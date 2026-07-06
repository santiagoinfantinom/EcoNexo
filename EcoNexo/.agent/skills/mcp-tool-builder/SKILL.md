---
name: mcp-tool-builder
description: Generates new MCP Tools for the EcoNexo Python backend. Use when adding new agent capabilities, creating API integrations, or extending the matching agent with new data sources.
---

# MCP Tool Builder

Automates the creation of new Tools for the EcoNexo MCP Server (LangGraph agent backend).

## When to Use

- Adding new data sources to the matching agent
- Creating integrations with external APIs
- Building new agent capabilities (calculators, validators, etc.)

## Architecture Context

Tools live in `mcp-server/src/tools/` and follow this pattern:
- Each tool is a Python function decorated for LangGraph
- Tools are registered in `matching_agent.py`
- Tools can be sync or async

## Workflow

1. **Define the tool** - Describe what it should do
2. **Generate scaffold** - Run `scripts/generate_tool.py <tool-name>`
3. **Implement logic** - Edit the generated file
4. **Register tool** - Add to agent's tool list
5. **Test** - Verify with the agent

## Tool Template

```python
"""
Tool: {tool_name}
Description: {description}
"""
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class {ToolName}Input(BaseModel):
    """Input schema for {tool_name}."""
    param1: str = Field(..., description="Description of param1")
    param2: Optional[int] = Field(None, description="Optional parameter")


async def {tool_name}(input: {ToolName}Input) -> Dict[str, Any]:
    """
    {description}
    
    Args:
        input: Validated input parameters
        
    Returns:
        Dictionary with results
    """
    # TODO: Implement tool logic
    return {
        "status": "success",
        "data": {}
    }
```

## Registration

Add to `mcp-server/src/agent/matching_agent.py`:

```python
from ..tools.{tool_file} import {tool_name}

tools = [
    # ... existing tools ...
    {tool_name},
]
```

## Best Practices

- Use Pydantic models for input validation
- Return structured dictionaries
- Handle errors gracefully with try/except
- Add logging for debugging
- Keep tools focused (single responsibility)
