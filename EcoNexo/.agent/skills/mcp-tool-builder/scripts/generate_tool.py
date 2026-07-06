#!/usr/bin/env python3
"""
MCP Tool Generator for EcoNexo

Generates a new tool scaffold for the MCP Server.

Usage:
    python generate_tool.py <tool-name> [--description "Tool description"]

Example:
    python generate_tool.py carbon_calculator --description "Calculates carbon footprint"
"""

import sys
import argparse
from pathlib import Path
from datetime import datetime


TOOL_TEMPLATE = '''"""
Tool: {tool_name}
Description: {description}
Created: {created_date}
"""
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field
import logging

logger = logging.getLogger(__name__)


class {class_name}Input(BaseModel):
    """Input schema for {tool_name}."""
    # TODO: Define your input parameters
    query: str = Field(..., description="Main query or input")
    options: Optional[Dict[str, Any]] = Field(None, description="Additional options")


class {class_name}Output(BaseModel):
    """Output schema for {tool_name}."""
    status: str = Field(..., description="success or error")
    data: Dict[str, Any] = Field(default_factory=dict, description="Result data")
    message: Optional[str] = Field(None, description="Status message")


async def {tool_name}(query: str, options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    {description}
    
    Args:
        query: Main query or input
        options: Additional options
        
    Returns:
        Dictionary with status and data
    """
    logger.info(f"{tool_name} called with query: {{query}}")
    
    try:
        # TODO: Implement your tool logic here
        result = {{
            "query": query,
            "processed": True,
            # Add your results here
        }}
        
        return {{
            "status": "success",
            "data": result,
            "message": "Tool executed successfully"
        }}
        
    except Exception as e:
        logger.error(f"Error in {tool_name}: {{e}}")
        return {{
            "status": "error",
            "data": {{}},
            "message": str(e)
        }}


# Tool metadata for LangGraph registration
TOOL_METADATA = {{
    "name": "{tool_name}",
    "description": "{description}",
    "input_schema": {class_name}Input.model_json_schema(),
}}
'''


def to_class_name(tool_name: str) -> str:
    """Convert snake_case to PascalCase."""
    return ''.join(word.capitalize() for word in tool_name.split('_'))


def generate_tool(tool_name: str, description: str, output_dir: Path) -> Path:
    """Generate a new tool file."""
    
    # Validate tool name
    if not tool_name.replace('_', '').isalnum():
        print(f"❌ Invalid tool name: {tool_name}")
        print("   Use snake_case with letters and numbers only")
        return None
    
    # Generate file content
    class_name = to_class_name(tool_name)
    content = TOOL_TEMPLATE.format(
        tool_name=tool_name,
        class_name=class_name,
        description=description,
        created_date=datetime.now().strftime("%Y-%m-%d")
    )
    
    # Write file
    output_file = output_dir / f"{tool_name}.py"
    
    if output_file.exists():
        print(f"⚠️  File already exists: {output_file}")
        response = input("Overwrite? [y/N]: ")
        if response.lower() != 'y':
            print("Aborted.")
            return None
    
    output_file.write_text(content)
    print(f"✅ Created tool: {output_file}")
    
    # Print registration instructions
    print("\n📝 Next steps:")
    print(f"1. Implement your logic in {output_file}")
    print(f"2. Add to mcp-server/src/agent/matching_agent.py:")
    print(f"   from ..tools.{tool_name} import {tool_name}")
    print(f"3. Add '{tool_name}' to the tools list")
    
    return output_file


def main():
    parser = argparse.ArgumentParser(description="Generate MCP Tool for EcoNexo")
    parser.add_argument("tool_name", help="Tool name in snake_case (e.g., carbon_calculator)")
    parser.add_argument("--description", "-d", default="A new MCP tool", 
                        help="Tool description")
    parser.add_argument("--output", "-o", default="mcp-server/src/tools",
                        help="Output directory (default: mcp-server/src/tools)")
    
    args = parser.parse_args()
    
    output_dir = Path(args.output)
    if not output_dir.exists():
        print(f"❌ Output directory not found: {output_dir}")
        print("   Make sure you're running from the project root")
        sys.exit(1)
    
    result = generate_tool(args.tool_name, args.description, output_dir)
    
    if result:
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
