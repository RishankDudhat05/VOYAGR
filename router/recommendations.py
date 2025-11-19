from fastapi import APIRouter, Depends, HTTPException
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException

from database import users_collection
from schemas import UserResponse
from .auth_routes import get_current_user
from config import GROQ_API_KEY

router = APIRouter(
    prefix="/recommendations",
    tags=["Search History & Recommendations"]
)

recommendations_prompt = (
    "You are a personalized travel recommendation AI assistant.\n"
    "The user has made several travel-related searches recently. Based on their search history, "
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
    '  "summary": "A brief summary explaining why these recommendations match their search history"\n'
    "}}\n\n"
    "CRITICAL: Use double quotes for all JSON keys and string values. Return 5-10 diverse recommendations."
)

llm = ChatGroq(
    api_key=GROQ_API_KEY,
    model="llama-3.3-70b-versatile",
    temperature=0.7
)

prompt_template = ChatPromptTemplate.from_messages([
    ("system", recommendations_prompt),
    ("user", "Based on these recent searches:\n{search_history}\n\nProvide personalized travel recommendations.")
])

parser = JsonOutputParser()
recommendations_chain = prompt_template | llm | parser


@router.get("/personalized", summary="Get personalized recommendations based on search history")
async def get_personalized_recommendations(
    current_user: UserResponse = Depends(get_current_user)
):
    try:
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
        
        search_history_text = "\n".join([f"- {query}" for query in queries])
        
        print(f"Generating recommendations for searches: {queries}")
        
        result = await recommendations_chain.ainvoke({"search_history": search_history_text})
        
        # Ensure result is a dict
        if not isinstance(result, dict):
            print(f"Warning: LLM returned non-dict: {type(result)}")
            result = {"recommendations": [], "summary": "Invalid response format"}
        
        result["based_on_searches"] = queries
        
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