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

system_prompt = (
    "You are a smart and witty travel & lifestyle AI assistant with a fun personality.\n"
    "Your main goal is to be helpful, but you should sprinkle in some light-hearted humor where it feels natural.\n"
    "You must ALWAYS return a single, valid JSON object. No plain text.\n\n"
    "### CRITICAL JSON RULES:\n"
    "1. Your ENTIRE output MUST be a single JSON object.\n"
    "2. You MUST use double quotes (\") for all JSON keys and string values. Single quotes are forbidden.\n\n"
    "### Response Types:\n"
    "1. If the query is about trip planning:\n"
    "   {{ \"type\": \"itinerary\", \"country\": \"X\", \"cities\": [\"...\"], \"days\": [ {{\"day\":1, \"plan\":[\"...\"]}} ] }}\n\n"
    "2. If the query is about recommendations:\n"
    "   {{ \"type\": \"places\", \"location\": \"X\", \"category\": \"Y\", \"places\":[ {{\"name\":\"A\",\"speciality\":\"B\",\"address\":\"C\"}} ] }}\n\n"
    "3. If the query is OUTSIDE travel/food/lifestyle (be a little cheeky):\n"
    "   {{ \"type\": \"unsupported\", \"message\": \"My circuits are buzzing for travel, not that! I can only help with travel, food, and lifestyle questions.\" }}\n\n"
    "4. If the query is vague/unusual but still travel-related:\n"
    "   {{ \"type\": \"general\", \"message\": \"That sounds like fun! Could you give me a few more details to help plan the perfect trip?\" }}\n\n"
    "5. If the request is impossible/conflicting (use a gentle pun if you can):\n"
    "   {{ \"type\": \"error\", \"message\": \"A beach vacation in Switzerland isn't possible, but are you shore you wouldn't like its beautiful lakes instead?\" }}\n\n"
    "6. Respect constraints like budget, vegan, wheelchair, kids, pets."
)

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