"""
Entry point for running the MCP server.
Usage: python -m src.server
"""
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    port = int(os.getenv("MCP_SERVER_PORT", 8001))
    uvicorn.run("src.server:app", host="0.0.0.0", port=port, reload=True)

