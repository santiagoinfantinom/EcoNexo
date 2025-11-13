# Setup Guide for EcoNexo MCP Server

## Quick Start

1. **Install Python dependencies:**
```bash
cd mcp-server
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Configure environment:**
```bash
cp env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

3. **Get Google Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy it to your `.env` file

4. **Start the server:**
```bash
# Option 1: Using the start script
./start.sh

# Option 2: Using Python directly
python -m src.server

# Option 3: Using uvicorn
uvicorn src.server:app --host 0.0.0.0 --port 8001
```

## Testing the Server

### Health Check
```bash
curl http://localhost:8001/health
```

### Test Matching Endpoint
```bash
curl -X POST http://localhost:8001/match \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "query": "Find environmental projects near Madrid"
  }'
```

## Integration with Next.js

1. **Start the MCP server** (port 8001 by default)

2. **Start Next.js dev server:**
```bash
npm run dev
```

3. **Access the matching page:**
   - Navigate to `http://localhost:3000/matching`
   - Or click "Matching" in the header navigation

## Troubleshooting

### Port Already in Use
If port 8001 is already in use, change it in `.env`:
```
MCP_SERVER_PORT=8002
```

### API Key Issues
- Verify your API key is correct
- Check that the key has access to Gemini API
- Ensure no extra spaces in `.env` file

### Connection Errors
- Ensure EcoNexo API is running on `ECONEXO_API_URL`
- Check CORS settings if calling from browser
- Verify network connectivity

### Import Errors
- Ensure you're in the virtual environment
- Reinstall dependencies: `pip install -r requirements.txt`
- Check Python version (3.10+ required)

## Development

### Running Tests
```bash
pytest tests/
```

### Debug Mode
Set logging level in code:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Hot Reload
The server supports hot reload when using uvicorn:
```bash
uvicorn src.server:app --reload
```

