# tripai.py
from fastapi import APIRouter, HTTPException, Query
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain.schema import OutputParserException
from config import GROQ_API_KEY

# Set the Groq API key

router = APIRouter(
    prefix="/travel",
    tags=["Travel & Places Recommendation AI"]
)

# -----------------------------
# LangChain Setup
# -----------------------------

# 1. Model
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.3,
    max_retries=2,
    timeout=30
)

# 2. Prompt Template
prompt = ChatPromptTemplate.from_messages([
    ("system",
     "You are a smart travel & lifestyle AI assistant.\n"
     "You must ONLY handle queries related to travel, food, lifestyle, and places.\n"
     "Always return structured JSON. No plain text.\n\n"
     "### Rules:\n"
     "1. If the query is about trip planning:\n"
     "{{ 'type': 'itinerary', 'country': X, 'cities': [...], 'days': [ {{'day':1, 'plan':[...]}} ] }}\n\n"
     "2. If the query is about food, malls, attractions, recommendations:\n"
     "{{ 'type': 'places', 'location': X, 'category': Y, 'places':[{{'name':A,'speciality':B,'address':C}}] }}\n\n"
     "3. If the query is OUTSIDE travel/food/lifestyle:\n"
     "{{ 'type': 'unsupported', 'message': 'I can only help with travel, food, places, and lifestyle related queries.' }}\n\n"
     "4. If the query is vague/unusual but still travel-related:\n"
     "{{ 'type': 'general', 'message': 'Polite, safe, generalized suggestion within travel context.' }}\n\n"
     "5. If the request is impossible/conflicting:\n"
     "{{ 'type': 'error', 'message': 'Explain clearly why it is not feasible. Suggest alternatives.' }}\n\n"
     "6. Respect constraints like budget, vegan, wheelchair, kids, pets.\n\n"
     "7. ALWAYS output VALID JSON ONLY (no explanatory text outside the JSON block)."
    ),
    ("user", "{user_prompt}")
])

# 3. JSON parser
parser = JsonOutputParser()

# 4. Chain
chain = prompt | llm | parser

