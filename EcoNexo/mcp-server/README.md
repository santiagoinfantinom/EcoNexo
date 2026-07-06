# EcoNexo MCP Server

MCP (Model Context Protocol) server for EcoNexo's intelligent volunteer matching agent using LangGraph and Google Gemini.

## Features

- **Intelligent Matching**: LangGraph-based agent that learns from user preferences
- **Natural Language Understanding**: Powered by Google Gemini
- **Detailed Explanations**: Understand why projects match your profile
- **Iterative Refinement**: Refine searches based on feedback
- **RESTful API**: HTTP endpoints for integration with Next.js

## Setup

### Prerequisites

- Python 3.10 or higher
- Google Gemini API key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. Create a virtual environment (recommended):
```bash
cd mcp-server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

### Environment Variables

- `GOOGLE_API_KEY`: Your Google Gemini API key (required)
- `ECONEXO_API_URL`: URL of EcoNexo API (default: http://localhost:3000/api)
- `MCP_SERVER_PORT`: Port for MCP server (default: 8001)

## Running the Server

```bash
python -m src.server
```

Or using uvicorn directly:
```bash
uvicorn src.server:app --host 0.0.0.0 --port 8001
```

The server will start on `http://localhost:8001`

## API Endpoints

### POST /match

Main endpoint for project matching.

**Request:**
```json
{
  "user_id": "user123",
  "query": "Find me environmental projects near Madrid",
  "context": {}
}
```

**Response:**
```json
{
  "matches": [
    {
      "id": "p1",
      "name": "Reforestación Urbana Berlín",
      "category": "Medio ambiente",
      "score": 85.5
    }
  ],
  "explanations": {
    "p1": "Match del 85%: A solo 12.3 km de tu ubicación. Coincide con tu interés en Medio ambiente.",
    "general": "Found 5 great matches based on your preferences!"
  },
  "suggestions": [
    "Explore projects in: Medio ambiente, Educación"
  ],
  "score_summary": {
    "p1": 85.5,
    "p2": 72.3
  }
}
```

### POST /explain

Explain why a specific project matches.

**Request:**
```json
{
  "user_id": "user123",
  "project_id": "p1"
}
```

**Response:**
```json
{
  "project_id": "p1",
  "score": 85.5,
  "explanation": "Match del 85%: A solo 12.3 km de tu ubicación. Coincide con tu interés en Medio ambiente."
}
```

### POST /refine

Refine search based on feedback.

**Request:**
```json
{
  "user_id": "user123",
  "query": "Show me more options",
  "feedback": {
    "negative": true,
    "reason": "Projects were too far away"
  },
  "previous_matches": ["p1", "p2"]
}
```

## Architecture

```
┌─────────────────┐
│   Next.js App   │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   MCP Server    │
│   (FastAPI)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  LangGraph      │
│  Agent          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MCP Tools      │
│  - User Tools   │
│  - Project Tools│
│  - Matching     │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  EcoNexo API    │
└─────────────────┘
```

## LangGraph Agent Flow

1. **analyze_profile**: Load user profile and history
2. **understand_intent**: Extract search criteria from query
3. **search_projects**: Find candidate projects
4. **calculate_matches**: Calculate match scores
5. **rank_matches**: AI-powered re-ranking
6. **generate_explanation**: Create natural language explanations
7. **handle_feedback**: Process feedback and refine (if needed)

## Development

### Running Tests

```bash
pytest tests/
```

### Code Structure

```
mcp-server/
├── src/
│   ├── agent/
│   │   ├── matching_agent.py  # LangGraph agent
│   │   └── state.py            # State definitions
│   ├── tools/
│   │   ├── user_tools.py       # User-related MCP tools
│   │   ├── project_tools.py    # Project-related MCP tools
│   │   ├── matching_tools.py   # Matching algorithms
│   │   └── partner_tools.py    # Partner integrations (future)
│   └── server.py               # FastAPI server
├── requirements.txt
├── env.example
└── README.md
```

## Future Integrations

The server is designed to support integrations with sustainable partner companies:

- Ecosia (info@ecosia.org)
- GLS Bank (info@gls.de)
- Shopify (support@shopify.com)
- Good On You (contact@goodonyou.eco)
- EcoCart (hello@ecocart.io)
- Wren (hello@wren.co)
- CleanChoice Energy (support@cleanchoiceenergy.com)
- EarthHero (hello@earthhero.com)
- Fairphone (info@fairphone.com)
- Zero Waste Home

## Troubleshooting

### Agent not initializing

- Check that `GOOGLE_API_KEY` is set correctly
- Verify API key is valid at Google AI Studio
- Check logs for specific error messages

### API connection errors

- Ensure EcoNexo API is running on `ECONEXO_API_URL`
- Check CORS settings if calling from browser
- Verify network connectivity

### Low match scores

- Review user profile data quality
- Check that projects have complete information
- Adjust matching algorithm weights if needed

## License

Part of EcoNexo project.

