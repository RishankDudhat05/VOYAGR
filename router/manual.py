from fastapi import APIRouter, Depends, HTTPException, Body
from database import users_collection
from .auth_routes import get_current_user
from schemas import UserResponse, LocationRecommendationRequest
from models import ManualTrip
from datetime import datetime
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException

import os
import json


llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.8
)

router = APIRouter(
    prefix="/manual",
    tags=["Manual Planner"]
)

@router.post("/create")
async def create_manual_trip(payload: ManualTrip, current_user: UserResponse = Depends(get_current_user)):

    trip_doc = {
        "user_email": current_user.email_id,
        "trip_name": payload.trip_name,
        "notes": payload.notes,
        "selected_places": payload.selected_places,
        "created_at": datetime.utcnow()
    }

    await users_collection.update_one(
        {"email_id": current_user.email_id},
        {"$push": {"manual_trips": trip_doc}}
    )

    return {"success": True, "trip": trip_doc}


# New LangChain pipeline for location-based recommendations
location_recommendation_prompt = ChatPromptTemplate.from_messages([
    ("system", """
You are a travel recommendation AI that suggests tourist attractions based on a specific place and location.
You must ALWAYS return a single, valid JSON object with the following structure:
{{
  "recommendations": [
    {{
      "name": "Place or attraction name",
      "location": "City, State/Country",
      "category": "Type (e.g., Beach, Historical, Adventure, Food, Temple, Park)",
      "description": "Brief description of the place and why it's worth visiting",
      "entry_price": "Entry cost or Free",
      "timings": "Opening hours (e.g., 9 AM - 6 PM)",
      "open_days": "Days open (e.g., All Days, Mon-Sat)"
    }}
  ],
  "summary": "A brief summary of why these places are recommended"
}}

CRITICAL: Use double quotes for all JSON keys and string values. Return exactly the number of recommendations requested.
"""),
    ("user", """
The user is looking for tourist places near or related to:
Place/Destination: {place_name}
Location/City: {location}

Do NOT recommend these places (already seen/selected):
{exclude_list}

Return exactly {top_k} unique recommendations of popular tourist attractions, landmarks, restaurants, or activities in or near this location.
Focus on diverse categories (historical, nature, food, cultural, adventure) to give variety.
""")
])

location_parser = JsonOutputParser()
location_recommendation_chain = location_recommendation_prompt | llm | location_parser


@router.post("/location-recommendations")
async def get_location_recommendations(
    request: LocationRecommendationRequest = Body(...),
    current_user: UserResponse = Depends(get_current_user)
):
    try:
        exclude_text = "\n".join([f"- {place}" for place in request.exclude]) if request.exclude else "None"
        
        print(f"Generating location recommendations for: {request.place_name} in {request.location}")
        
        result = await location_recommendation_chain.ainvoke({
            "place_name": request.place_name,
            "location": request.location,
            "exclude_list": exclude_text,
            "top_k": str(request.top_k),
        })
        
        if not isinstance(result, dict):
            print(f"Warning: LLM returned non-dict: {type(result)}")
            result = {"recommendations": [], "summary": "Invalid response format"}
        
        return result
    
    except OutputParserException as e:
        print(f"OutputParserException: {str(e)}")
        return {
            "recommendations": [],
            "summary": "Unable to parse AI recommendations. Please try again.",
            "error": str(e)
        }
    
    except Exception as e:
        print(f"Error in location recommendations: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error generating recommendations: {str(e)}"
        )

