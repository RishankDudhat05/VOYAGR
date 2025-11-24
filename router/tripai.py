from config import GROQ_API_KEY
from fastapi import APIRouter, Query, HTTPException, Depends
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
from datetime import datetime
from .auth_routes import get_current_user
from schemas import UserResponse
from database import users_collection

router = APIRouter(
    prefix="/travel",
    tags=["Travel & Places Recommendation AI"]
)

system_prompt = """
You are a smart and witty travel & lifestyle AI assistant with a fun personality.
Your main goal is to be helpful, but you should sprinkle in some light-hearted humor where it feels natural.
You must ALWAYS return a single, valid JSON object. No plain text.

### CRITICAL JSON RULES:
1. Your ENTIRE output MUST be a single JSON object.
2. You MUST use double quotes (") for all JSON keys and string values. Single quotes are forbidden.

### GENERAL ITINERARY RULES (IMPORTANT):
- If the user asks for an N-day trip, you MUST create exactly N entries in "days", with "day": 1, 2, ..., N.
- Each day MUST cover the whole day (morning to evening) with sightseeing/activities.
- For each day, you MUST include AT LEAST 4 places in "places". Prefer 4–7 places depending on travel time.
- Do NOT create empty or half-empty days (no day should have fewer than 3 places unless the user explicitly asks for a very relaxed / single-place day).
- Use realistic "timeLabel" such as  "2–3 hrs", etc.
- Use short, helpful descriptions that a frontend card can display directly.

### Response Types:

1. If the query is about trip planning:
   {{
     "type": "itinerary",
     "country": "X",
     "cities": ["..."],
     "days": [
       {{
         "day": 1,
         "date": "15 Oct, 2025",
         "places": [
            {{
              "id": "1",
              "name": "Sabarmati Ashram",
              "location": "Ahmedabad",
              "tags": ["Historical"],
              "rating": 4.5,
              "reviews": 1200,
              "description": "A peaceful historic site by the river.",
              "priceLabel": "Free",
              "timeLabel": "2 to 3 hrs"
            }},
            {{
              "id": "2",
              "name": "Riverfront Promenade",
              "location": "Ahmedabad",
              "tags": ["Scenic", "Leisure"],
              "rating": 4.3,
              "reviews": 800,
              "description": "Relaxing walk along the Sabarmati river.",
              "priceLabel": "Free",
              "timeLabel": "2 to 2.5 hrs"
            }},
            {{
              "id": "3",
              "name": "Manek Chowk",
              "location": "Ahmedabad",
              "tags": ["Food", "Street Food"],
              "rating": 4.6,
              "reviews": 2500,
              "description": "Famous night street food hub with local delicacies.",
              "priceLabel": "₹300–₹600 per person",
              "timeLabel": ""
            }}
         ]
       }}
     ]
   }}

   → ALWAYS use this structure for itineraries.
   → The frontend will directly render these fields into PlaceCard.
   → Make sure each requested day has multiple "places" filled.

2. If the query is about recommendations:
   {{
     "type": "places",
     "location": "X",
     "category": "Y",
     "places": [
       {{
         "id": "p1",
         "name": "A",
         "location": "City",
         "tags": ["Tag1", "Tag2"],
         "rating": 4.4,
         "reviews": 900,
         "description": "B",
         "priceLabel": "₹300",
         "timeLabel": "2 hrs"
       }}
     ]
   }}

3. If the query is OUTSIDE travel/food/lifestyle (be a little cheeky):
   {{
     "type": "unsupported",
     "message": "My circuits are buzzing for travel, not that! I can only help with travel, food, and lifestyle questions."
   }}

4. If the query is vague/unusual but still travel-related:
   {{
     "type": "general",
     "message": "That sounds like fun! Could you give me a few more details to help plan the perfect trip?"
   }}

5. If the request is impossible/conflicting (use a gentle pun if you can):
   {{
     "type": "error",
     "message": "A beach vacation in Switzerland isn't possible, but are you shore you wouldn't like its beautiful lakes instead?"
   }}

6. Respect constraints like budget, vegan, wheelchair, kids, pets.
"""


# --- LangChain Setup ---
llm = ChatGroq(
    api_key=GROQ_API_KEY,
    model="llama-3.3-70b-versatile",
    temperature=0.4
)

prompt_template = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("user", "{user_prompt}")
])

parser = JsonOutputParser()

chain = prompt_template | llm | parser

async def save_search(prompt: str, response_type: str, user_email: str) -> None:
    
    try:
        user = await users_collection.find_one({"email_id": user_email})
        search_history = user.get("search_history", []) if user else []
        
        is_duplicate = False
        if search_history:
            last_search = search_history[-1]
            if last_search.get("query") == prompt:
                last_time = last_search.get("timestamp")
                if last_time:
                    time_diff = (datetime.now() - last_time).total_seconds()
                    if time_diff < 5:
                        is_duplicate = True
        
        if not is_duplicate:
            search_item = {
                "query": prompt,
                "timestamp": datetime.now(),
                "response_type": response_type
            }
            
            await users_collection.update_one(
                {"email_id": user_email},
                {
                    "$push": {
                        "search_history": {
                            "$each": [search_item],
                            "$slice": -10
                        }
                    }
                }
            )
    except Exception as hist_error:
        print(f"Failed to save search history: {hist_error}")


# --- FastAPI Endpoint (Simplified) ---
@router.get("/generate", summary="Ask AI for travel, food, or lifestyle questions")
async def generate_response(
    prompt: str = Query(..., description="Your travel/food/places/lifestyle question"),
    save_to_history: bool = True,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Example prompts:
      - Plan me a 3-day trip to Paris
      - Top 3 spicy foods in India
      - what is the meaning of life
    
    Automatically saves searches to your history for personalized recommendations.
    """
    try:
        result = await chain.ainvoke({"user_prompt": prompt})
        if "type" not in result:
            result["type"] = "general"
        
        if save_to_history:
            await save_search(
                prompt=prompt,
                response_type=result.get("type", "unknown"),
                user_email=current_user.email_id
            )
        
        return result

    except OutputParserException as e:
        return {
            "type": "error",
            "message": "The AI returned a response in an invalid format.",
            "raw_error": str(e)
        }

    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
