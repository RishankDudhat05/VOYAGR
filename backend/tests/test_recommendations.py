import pytest
from httpx import AsyncClient
from unittest.mock import patch, AsyncMock


@pytest.mark.api
@pytest.mark.unit
class TestRecommendations:
  
    
    async def test_getting_recommendations(
        self,
        test_client: AsyncClient,
        authenticated_user,
        mock_groq_llm,
        mock_users_collection
    ):
       
        token = authenticated_user["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
      
        await test_client.get(
            "/travel/generate",
            params={"prompt": "Best places in Paris"},
            headers=headers
        )
        await test_client.get(
            "/travel/generate",
            params={"prompt": "Paris restaurants"},
            headers=headers
        )
       
        mock_llm_response = {
            "recommendations": [
                {"name": "Eiffel Tower", "score": 0.95, "description": "Iconic landmark"},
                {"name": "Louvre Museum", "score": 0.92, "description": "World-famous museum"}
            ],
            "summary": "Based on your Paris searches, here are some recommendations"
        }
        
        with patch("router.recommendations.recommendations_chain") as mock_chain:
            mock_chain.ainvoke = AsyncMock(return_value=mock_llm_response)
            
            response = await test_client.get(
                "/recommendations/personalized",
                headers=headers
            )
        
        assert response.status_code == 200
        data = response.json()
        assert "recommendations" in data
        assert len(data["recommendations"]) > 0
        
   
        response2 = await test_client.get("/recommendations/personalized")
        assert response2.status_code == 401
    
        bad_headers = {"Authorization": "Bearer invalid_token"}
        response3 = await test_client.get(
            "/recommendations/personalized",
            headers=bad_headers
        )
        assert response3.status_code == 401
        
    async def test_weird_cases(
        self,
        test_client: AsyncClient,
        authenticated_user,
        mock_groq_llm,
        mock_users_collection
    ):
  
        token = authenticated_user["token"]
        headers = {"Authorization": f"Bearer {token}"}
      
        response = await test_client.get(
            "/recommendations/personalized",
            headers=headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["recommendations"] == []
        assert "No search history" in data["summary"]
       
        for i in range(7):
            await test_client.get(
                "/travel/generate",
                params={"prompt": f"Search number {i}"},
                headers=headers
            )
        
        mock_llm_response = {
            "recommendations": [
                {"name": "Place 1", "score": 0.9, "description": "Description 1"}
            ],
            "summary": "Recommendations based on your recent searches"
        }
        
        with patch("router.recommendations.recommendations_chain") as mock_chain:
            mock_chain.ainvoke = AsyncMock(return_value=mock_llm_response)
            
            response = await test_client.get(
                "/recommendations/personalized",
                headers=headers
            )
        
        assert response.status_code == 200
        data = response.json()
      
        assert len(data["based_on_searches"]) <= 5

    async def test_errors(
        self,
        test_client: AsyncClient,
        authenticated_user,
        mock_groq_llm
    ):

        token = authenticated_user["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        await test_client.get(
            "/travel/generate",
            params={"prompt": "Paris"},
            headers=headers
        )
        
    
        with patch("router.recommendations.recommendations_chain") as mock_chain:
            mock_chain.ainvoke = AsyncMock(side_effect=Exception("LLM service unavailable"))
            
            response = await test_client.get(
                "/recommendations/personalized",
                headers=headers
            )
        
        assert response.status_code == 500
        
     
        with patch("router.recommendations.recommendations_chain") as mock_chain:
            mock_chain.ainvoke = AsyncMock(return_value="Invalid response format")
            
            response = await test_client.get(
                "/recommendations/personalized",
                headers=headers
            )
        
        assert response.status_code == 200
        data = response.json()
        assert data["recommendations"] == []
        
    
        mock_collection = AsyncMock()
        mock_collection.find_one = AsyncMock(return_value=None)
        
        with patch("router.recommendations.users_collection", mock_collection):
            response = await test_client.get(
                "/recommendations/personalized",
                headers=headers
            )
        
        assert response.status_code == 404
        
     
        with patch("router.recommendations.recommendations_chain") as mock_chain:
            mock_chain.ainvoke = AsyncMock(return_value={"recommendations": [], "summary": "No recommendations"})
            
            response = await test_client.get(
                "/recommendations/personalized",
                headers=headers
            )
        
        assert response.status_code == 200
        data = response.json()
        assert data["recommendations"] == []
        

        from langchain_core.exceptions import OutputParserException
        with patch("router.recommendations.recommendations_chain") as mock_chain:
            mock_chain.ainvoke = AsyncMock(side_effect=OutputParserException("Invalid JSON"))
            
            response = await test_client.get(
                "/recommendations/personalized",
                headers=headers
            )
        
        assert response.status_code == 200
        data = response.json()
        assert data["recommendations"] == []

    async def test_full_flow(
        self,
        test_client: AsyncClient,
        authenticated_user,
        mock_groq_llm
    ):
       
        token = authenticated_user["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        prompts = [
            "Best places in Paris",
            "Paris museums",
            "Eiffel Tower visit tips"
        ]
        
        for prompt in prompts:
            await test_client.get(
                "/travel/generate",
                params={"prompt": prompt},
                headers=headers
            )
 
        mock_llm_response = {
            "recommendations": [
                {"name": "Eiffel Tower", "score": 0.95, "description": "Iconic Paris landmark"},
                {"name": "Louvre Museum", "score": 0.92, "description": "Famous art museum"},
                {"name": "Notre-Dame", "score": 0.88, "description": "Historic cathedral"}
            ],
            "summary": "Based on your Paris searches, here are top recommendations"
        }
        
        with patch("router.recommendations.recommendations_chain") as mock_chain:
            mock_chain.ainvoke = AsyncMock(return_value=mock_llm_response)
            
            response = await test_client.get(
                "/recommendations/personalized",
                headers=headers
            )
        
        assert response.status_code == 200
        data = response.json()
        
      
        assert len(data["recommendations"]) > 0
        assert len(data["based_on_searches"]) == len(prompts)
        assert "Paris" in data["summary"] or "paris" in data["summary"].lower()
    
    async def test_user_isolation(
        self,
        test_client: AsyncClient,
        mock_groq_llm
    ):
       
        user1_data = {
            "name": "user1test",
            "email_id": "user1@test.com",
            "password": "password123"
        }
        await test_client.post("/auth/signup", json=user1_data)
        login_response1 = await test_client.post(
            "/auth/token",
            data={"username": user1_data["email_id"], "password": user1_data["password"]},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        token1 = login_response1.json()["access_token"]
        
      
        user2_data = {
            "name": "user2test",
            "email_id": "user2@test.com",
            "password": "password123"
        }
        await test_client.post("/auth/signup", json=user2_data)
        login_response2 = await test_client.post(
            "/auth/token",
            data={"username": user2_data["email_id"], "password": user2_data["password"]},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        token2 = login_response2.json()["access_token"]
  
        await test_client.get(
            "/travel/generate",
            params={"prompt": "Paris attractions"},
            headers={"Authorization": f"Bearer {token1}"}
        )
        
        mock_llm_response = {
            "recommendations": [
                {"name": "Eiffel Tower", "score": 0.95, "description": "Iconic landmark"}
            ],
            "summary": "Paris recommendations"
        }
        
        with patch("router.recommendations.recommendations_chain") as mock_chain:
            mock_chain.ainvoke = AsyncMock(return_value=mock_llm_response)
            
       
            response1 = await test_client.get(
                "/recommendations/personalized",
                headers={"Authorization": f"Bearer {token1}"}
            )
            assert response1.status_code == 200
            assert len(response1.json()["recommendations"]) > 0
        
      
        response2 = await test_client.get(
            "/recommendations/personalized",
            headers={"Authorization": f"Bearer {token2}"}
        )
        assert response2.status_code == 200
        assert len(response2.json()["recommendations"]) == 0
