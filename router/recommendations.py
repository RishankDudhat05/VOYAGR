from fastapi import APIRouter, Depends, HTTPException, Body
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
from pydantic import BaseModel
from typing import List

from database import users_collection
from schemas import UserResponse
from .auth_routes import get_current_user
from config import GROQ_API_KEY

router = APIRouter(
    prefix="/recommendations",
    tags=["Search History & Recommendations"]
)

class RecommendationRequest(BaseModel):
    added_places: List[str] = []
    top_k: int = 5
    exclude: List[str] = []

recommendations_prompt = (
    "You are a personalized travel recommendation AI assistant.\n"
    "The user has made several travel-related searches recently and has also manually added some places to their itinerary. "
    "Based on their search history AND the places they have already selected, "
    "generate tailored travel recommendations that match their interests.\n\n"
    "You must ALWAYS return a single, valid JSON object with the following structure:\n"
    "{{\n"
    '  "recommendations": [\n'
    '    {{\n'
    '      "name": "Place or destination name",\n'
    '      "location": "City, Country",\n'
    '      "category": "Type (e.g., Beach, Historical, Adventure, Food)",\n'
    '      "description": "Brief description of why this matches their interests",\n'
    '      "entry_price": "Entry cost or Free",\n'
    '      "timings": "Opening hours if applicable",\n'
    '      "open_days": "Days open if applicable"\n'
    '    }}\n'
    '  ],\n'
    '  "summary": "A brief summary explaining why these recommendations match their search history and selected places"\n'
    "}}\n\n"
    "CRITICAL: Use double quotes for all JSON keys and string values. When a desired count (top_k) is provided, return exactly that many recommendations; otherwise return 5 recommendations by default."
)

llm = ChatGroq(
    api_key=GROQ_API_KEY,
    model="llama-3.3-70b-versatile",
    temperature=0.7
)

prompt_template = ChatPromptTemplate.from_messages([
    ("system", recommendations_prompt),
    (
        "user",
        "Based on these recent searches:\n{search_history}\n\nAnd these places already added to the itinerary:\n{added_places}\n\nDo NOT recommend these places (already seen/selected):\n{exclude_list}\n\nReturn exactly {top_k} recommendations and provide a short summary explaining why these recommendations match the user's interests."
    ),
])

parser = JsonOutputParser()
recommendations_chain = prompt_template | llm | parser


@router.post("/personalized", summary="Get personalized recommendations based on search history and added places")
async def get_personalized_recommendations(
    request: RecommendationRequest = Body(...),
    current_user: UserResponse = Depends(get_current_user)
):
    try:
        user = await users_collection.find_one({"email_id": current_user.email_id})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        search_history = user.get("search_history", [])
        added_places = request.added_places
        
        if not search_history and not added_places:
            return {
                "recommendations": [],
                "based_on_searches": [],
                "summary": "No search history or added places found. Start searching or adding places to get personalized recommendations!"
            }
        
        queries = [item["query"] for item in search_history[-5:]]
        
        search_history_text = "\n".join([f"- {query}" for query in queries])
        added_places_text = "\n".join([f"- {place}" for place in added_places])
        exclude_text = "\n".join([f"- {place}" for place in request.exclude])
        
        print(f"Generating recommendations for searches: {queries} and added places: {added_places}")
        
        result = await recommendations_chain.ainvoke({
            "search_history": search_history_text,
            "added_places": added_places_text,
            "exclude_list": exclude_text,
            "top_k": str(request.top_k),
        })
        
        # Ensure result is a dict
        if not isinstance(result, dict):
            print(f"Warning: LLM returned non-dict: {type(result)}")
            result = {"recommendations": [], "summary": "Invalid response format"}
        
        result["based_on_searches"] = queries
        result["based_on_added_places"] = added_places
        
        return result
    
    except OutputParserException as e:
        print(f"OutputParserException: {str(e)}")
        return {
            "recommendations": [],
            "based_on_searches": queries if 'queries' in locals() else [],
            "summary": "Unable to parse AI recommendations. Please try again.",
            "error": str(e)
        }
    
    except HTTPException:
        raise
    
    except Exception as e:
        print(f"Error in recommendations: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error generating recommendations: {str(e)}"
        )
