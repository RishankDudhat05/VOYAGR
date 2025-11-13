from fastapi import APIRouter, Depends, HTTPException

from database import users_collection
from schemas import UserResponse
from .auth_routes import get_current_user
from search import semantic_search

router = APIRouter(
    prefix="/recommendations",
    tags=["Search History & Recommendations"]
)


@router.get("/personalized", summary="Get personalized recommendations based on search history")
async def get_personalized_recommendations(
    top_k: int = 20,
    current_user: UserResponse = Depends(get_current_user)
):
    
    user = await users_collection.find_one({"email_id": current_user.email_id})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    search_history = user.get("search_history", [])
    
    if not search_history:
        return {
            "recommendations": [],
            "based_on_searches": [],
            "summary": "No search history found. Start searching to get personalized recommendations!"
        }
    
    queries = [item["query"] for item in search_history[-5:]]
    
    combined_query = " ".join(queries)
    
    try:
        all_recommendations = semantic_search(combined_query, top_k)
        
        filtered_recommendations = [
            rec for rec in all_recommendations 
            if rec.get("score", 0) > 0.5
        ]
        
        seen_names = set()
        unique_recommendations = []
        for rec in filtered_recommendations:
            name = rec.get("name")
            if name and name not in seen_names:
                seen_names.add(name)
                unique_recommendations.append(rec)
        
        cities = set()
        keywords = set()
        
        for query in queries:
            words = query.lower().split()
            for word in words:
                if len(word) > 3:
                    keywords.add(word)
        
        for rec in unique_recommendations:
            if "city" in rec:
                cities.add(rec["city"])
        
        summary = f"Based on your recent searches about {', '.join(list(keywords)[:5])}, here are personalized recommendations"
        if cities:
            summary += f" from {', '.join(list(cities)[:3])}"
        summary += "."
        
        return {
            "recommendations": unique_recommendations,
            "based_on_searches": queries,
            "summary": summary
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating recommendations: {str(e)}"
        )