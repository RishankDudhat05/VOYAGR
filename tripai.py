# tripai.py
from fastapi import APIRouter, HTTPException, Query
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain.schema import OutputParserException
from config import GROQ_API_KEY


router = APIRouter(
    prefix="/travel",
    tags=["Travel & Places Recommendation AI"]
)

# 1. Model
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.3,
    max_retries=2,
    timeout=30
)

# 2. Prompt Template
prompt = ChatPromptTemplate.from_messages([])  # write the prompt 

# 3. JSON parser
parser = JsonOutputParser()

# 4. Chain
chain = prompt | llm | parser

