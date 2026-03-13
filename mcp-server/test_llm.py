import os
import sys
from dotenv import load_dotenv

load_dotenv("/Users/santiago/Documents/Projects/EcoNexo/mcp-server/.env")

print(f"Key loaded: {'Yes' if os.environ.get('GOOGLE_API_KEY') else 'No'}")

try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=os.environ.get("GOOGLE_API_KEY"))
    res = llm.invoke("Hello")
    print(f"gemini-1.5-flash: {res.content}")
except Exception as e:
    print(f"gemini-1.5-flash error: {e}")

try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=os.environ.get("GOOGLE_API_KEY"))
    res = llm.invoke("Hello")
    print(f"gemini-2.0-flash: {res.content}")
except Exception as e:
    print(f"gemini-2.0-flash error: {e}")
