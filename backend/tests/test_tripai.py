import pytest
from httpx import AsyncClient
from datetime import datetime
from unittest.mock import patch, AsyncMock


@pytest.mark.api
@pytest.mark.unit
class TestTripAI:

    
    async def test_generation_scenarios(
        self, 
        test_client: AsyncClient, 
        authenticated_user,
        mock_groq_llm
    ):
        
        token = authenticated_user["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
  
        response = await test_client.get(
            "/travel/generate",
            params={"prompt": "Plan me a 3-day trip to Paris"},
            headers=headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["type"] == "itinerary"
        assert "Paris" in data["cities"]
        
    
        response = await test_client.get(
            "/travel/generate",
            params={"prompt": "Top 3 spicy foods in India"},
            headers=headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["type"] == "places"
        assert data["location"] == "India"
        
        
        response = await test_client.get(
            "/travel/generate",
            params={"prompt": "what is the meaning of life"},
            headers=headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["type"] == "unsupported"
    
        response = await test_client.get(
            "/travel/generate",
            params={"prompt": "I want to travel somewhere nice"},
            headers=headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["type"] == "general"
    
    async def test_auth_and_validation(
        self,
        test_client: AsyncClient,
        authenticated_user,
        mock_groq_llm
    ):
        # checking if security works
        

        response = await test_client.get(
            "/travel/generate",
            params={"prompt": "Plan a trip to Tokyo"}
        )
        assert response.status_code == 401
        
       
        bad_headers = {"Authorization": "Bearer invalid_token"}
        response = await test_client.get(
            "/travel/generate",
            params={"prompt": "Plan a trip to Tokyo"},
            headers=bad_headers
        )
        assert response.status_code == 401
        
   
        token = authenticated_user["token"]
        headers = {"Authorization": f"Bearer {token}"}
        response = await test_client.get(
            "/travel/generate",
            headers=headers
        )
        assert response.status_code == 422
        
    
        response = await test_client.get(
            "/travel/generate",
            params={"prompt": ""},
            headers=headers
        )
        assert response.status_code == 422

        long_prompt = "Plan a trip " * 500
        response = await test_client.get(
            "/travel/generate",
            params={"prompt": long_prompt},
            headers=headers
        )
        assert response.status_code == 200
   
        response = await test_client.get(
            "/travel/generate",
            params={"prompt": "Plan trip to Paris! @#$% & café"},
            headers=headers
        )
        assert response.status_code == 200


@pytest.mark.api
@pytest.mark.unit
class TestSearchHistory:
    # testing if history is saved correctly
    
    async def test_history_logic(
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
            params={"prompt": "Plan trip to Paris"},
            headers=headers
        )
        user = await mock_users_collection.find_one(
            {"email_id": authenticated_user["user_data"]["email_id"]}
        )
        assert len(user["search_history"]) > 0
        assert user["search_history"][-1]["query"] == "Plan trip to Paris"
        
      
        await test_client.get(
            "/travel/generate",
            params={
                "prompt": "Plan trip to Tokyo",
                "save_to_history": False
            },
            headers=headers
        )
        user = await mock_users_collection.find_one(
            {"email_id": authenticated_user["user_data"]["email_id"]}
        )
    
        if "search_history" in user and user["search_history"]:
            for item in user["search_history"]:
                assert "Tokyo" not in item["query"]
        

        prompt = "Plan trip to Rome"
        await test_client.get(
            "/travel/generate",
            params={"prompt": prompt},
            headers=headers
        )
        await test_client.get(
            "/travel/generate",
            params={"prompt": prompt},
            headers=headers
        )
        user = await mock_users_collection.find_one(
            {"email_id": authenticated_user["user_data"]["email_id"]}
        )
        rome_searches = [item for item in user.get("search_history", []) if item["query"] == prompt]
        assert len(rome_searches) <= 1
        
        for i in range(15):
            await test_client.get(
                "/travel/generate",
                params={"prompt": f"Plan trip number {i}"},
                headers=headers
            )
        user = await mock_users_collection.find_one(
            {"email_id": authenticated_user["user_data"]["email_id"]}
        )
        assert len(user.get("search_history", [])) <= 10
        
        await test_client.get(
            "/travel/generate",
            params={"prompt": "Plan trip to Paris"},
            headers=headers
        )
        user = await mock_users_collection.find_one(
            {"email_id": authenticated_user["user_data"]["email_id"]}
        )
        last_search = user["search_history"][-1]
        assert last_search["response_type"] == "itinerary"
        
        from router.tripai import save_search 
    
        with patch("router.tripai.users_collection") as mock_coll:
            mock_coll.find_one = AsyncMock(return_value=None)
            mock_coll.update_one = AsyncMock()
            await save_search("test query", "test_type", "nonexistent@example.com")
        
    
        with patch("router.tripai.users_collection") as mock_coll:
            mock_coll.find_one = AsyncMock(side_effect=Exception("DB error"))
            await save_search("test", "type", authenticated_user["user_data"]["email_id"])
        
      
        with patch("router.tripai.users_collection") as mock_coll:
            mock_coll.find_one = AsyncMock(return_value={"email_id": "test@test.com", "search_history": []})
            mock_coll.update_one = AsyncMock(side_effect=Exception("Update failed"))
            await save_search("test", "type", authenticated_user["user_data"]["email_id"])
        
      
        import time
        from datetime import datetime, timedelta
        old_timestamp = datetime.now() - timedelta(seconds=10)
        user_with_old_search = {
            "email_id": authenticated_user["user_data"]["email_id"],
            "search_history": [{"query": "old query", "timestamp": old_timestamp}]
        }
        with patch("router.tripai.users_collection") as mock_coll:
            mock_coll.find_one = AsyncMock(return_value=user_with_old_search)
            mock_coll.update_one = AsyncMock()
            await save_search("old query", "type", authenticated_user["user_data"]["email_id"])
            mock_coll.update_one.assert_called_once()
        
    
        user_no_timestamp = {
            "email_id": authenticated_user["user_data"]["email_id"],
            "search_history": [{"query": "test query"}]
        }
        with patch("router.tripai.users_collection") as mock_coll:
            mock_coll.find_one = AsyncMock(return_value=user_no_timestamp)
            mock_coll.update_one = AsyncMock()
            await save_search("test query", "type", authenticated_user["user_data"]["email_id"])
            mock_coll.update_one.assert_called_once()
        
        recent_timestamp = datetime.now() - timedelta(seconds=2)
        user_with_recent_search = {
            "email_id": authenticated_user["user_data"]["email_id"],
            "search_history": [{"query": "recent query", "timestamp": recent_timestamp}]
        }
        with patch("router.tripai.users_collection") as mock_coll:
            mock_coll.find_one = AsyncMock(return_value=user_with_recent_search)
            mock_coll.update_one = AsyncMock()
            await save_search("recent query", "type", authenticated_user["user_data"]["email_id"])
            mock_coll.update_one.assert_not_called()
        
        user_diff_query = {
            "email_id": authenticated_user["user_data"]["email_id"],
            "search_history": [{"query": "different query", "timestamp": datetime.now()}]
        }
        with patch("router.tripai.users_collection") as mock_coll:
            mock_coll.find_one = AsyncMock(return_value=user_diff_query)
            mock_coll.update_one = AsyncMock()
            await save_search("new query", "type", authenticated_user["user_data"]["email_id"])
            mock_coll.update_one.assert_called_once()



@pytest.mark.api
@pytest.mark.unit
class TestErrors:
    
    async def test_llm_errors(
        self,
        test_client: AsyncClient,
        authenticated_user
    ):
        
        token = authenticated_user["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        
        from langchain_core.exceptions import OutputParserException
        
        with patch("router.tripai.chain") as mock_chain:
            async def mock_error(*args, **kwargs):
                raise OutputParserException("Invalid JSON output")
            
            mock_chain.ainvoke = mock_error
            
            response = await test_client.get(
                "/travel/generate",
                params={"prompt": "Plan trip to Paris"},
                headers=headers
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["type"] == "error"
        
        with patch("router.tripai.chain") as mock_chain:
            async def mock_error(*args, **kwargs):
                raise Exception("API rate limit exceeded")
            
            mock_chain.ainvoke = mock_error
            
            response = await test_client.get(
                "/travel/generate",
                params={"prompt": "Plan trip to Paris"},
                headers=headers
            )
            
            assert response.status_code == 502
        
        with patch("router.tripai.chain") as mock_chain:
            async def mock_response(*args, **kwargs):
                return {"message": "Some response without type"}
            
            mock_chain.ainvoke = mock_response
            
            response = await test_client.get(
                "/travel/generate",
                params={"prompt": "Plan trip to Paris"},
                headers=headers
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["type"] == "general"

    async def test_integration(
        self,
        test_client: AsyncClient,
        authenticated_user,
        mock_groq_llm
    ):
    
        token = authenticated_user["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
    
        response1 = await test_client.get(
            "/travel/generate",
            params={"prompt": "Plan trip to Paris"},
            headers=headers
        )
        assert response1.status_code == 200
        assert response1.json()["type"] == "itinerary"
        
        response2 = await test_client.get(
            "/travel/generate",
            params={"prompt": "Best spicy foods"},
            headers=headers
        )
        assert response2.status_code == 200
        assert response2.json()["type"] == "places"
        
    
        response3 = await test_client.get(
            "/travel/generate",
            params={"prompt": "What is programming"},
            headers=headers
        )
        assert response3.status_code == 200
        assert response3.json()["type"] == "unsupported"
