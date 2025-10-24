#!/bin/bash

echo "Installing Mac Control MCP Server..."

# Install dependencies
npm install

# Build the project
npm run build

echo ""
echo "✓ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Add the following to your Claude Desktop config:"
echo "   File: ~/Library/Application Support/Claude/claude_desktop_config.json"
echo ""
echo '   {
     "mcpServers": {
       "mac-control": {
         "command": "node",
         "args": ["'$(pwd)'/build/index.js"]
       }
     }
   }'
echo ""
echo "2. Restart Claude Desktop"
echo "3. Grant necessary permissions in System Settings > Privacy & Security"
echo ""
