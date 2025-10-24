# Quick Start Guide

## Prerequisites

- macOS 10.15+ (Catalina or later)
- Node.js v20+
- Claude Desktop app

## Installation

### Option 1: Using install script

```bash
cd /path/to/mac-control-mcp
./install.sh
```

### Option 2: Manual installation

```bash
cd /path/to/mac-control-mcp
npm install
npm run build
```

## Configuration

1. Get the absolute path to the project:
```bash
pwd
# Example output: /Users/yourname/mac-control-mcp
```

2. Open Claude Desktop config:
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

3. Add the mac-control server (replace the path):
```json
{
  "mcpServers": {
    "mac-control": {
      "command": "node",
      "args": ["/Users/yourname/mac-control-mcp/build/index.js"]
    }
  }
}
```

4. **Restart Claude Desktop completely** (Cmd+Q and reopen)

## Required Permissions

After restarting Claude Desktop, you'll need to grant permissions:

1. **System Settings > Privacy & Security > Accessibility**
   - Click the lock icon to unlock
   - Click the "+" button
   - Find and add "Claude" (or "node" if Claude doesn't appear)

2. **System Settings > Privacy & Security > Automation**
   - Allow "Claude" or "node" to control:
     - System Events
     - Finder
     - Any other apps you want to control

## Testing

Once configured and permissions are granted, open Claude Desktop and try:

### System Control
```
"What's my current volume?"
"Set volume to 50"
"Show me battery status"
"Get system information"
```

### Application Management
```
"Open Safari"
"List running applications"
"Close Safari"
"Is Chrome running?"
```

### File Operations
```
"Open my Downloads folder"
"Show me info about ~/Desktop"
"Search for files with 'meeting' in the name"
```

## Troubleshooting

### MCP Server Not Showing Up

1. Check that the path in config is **absolute** (starts with `/`)
2. Verify build succeeded: `ls build/index.js`
3. Restart Claude Desktop completely (Cmd+Q)
4. Check Claude Desktop logs for errors

### Permission Denied Errors

1. System Settings > Privacy & Security
2. Go to Accessibility and Automation
3. Make sure Claude or node is added and enabled
4. Try restarting Claude Desktop after granting permissions

### Application Commands Not Working

- Use full application names: "Google Chrome" not "Chrome"
- Use exact names as shown in Applications folder
- Try `list_running_apps` to see correct names

## Available Tools

The server provides 19 tools across 3 categories:

**System Control (7 tools)**
- Volume control (get/set/mute)
- Brightness control (get/set)
- Battery status
- System information

**Application Management (6 tools)**
- Open/close applications
- List running apps
- Activate/switch apps
- Hide applications
- Check if app is running

**File Operations (6 tools)**
- Open files/folders
- Reveal in Finder
- Spotlight search
- Get file info
- Move to trash

## Next Steps

- Check out the full [README.md](README.md) for detailed documentation
- Explore all available tools by asking Claude "What Mac control tools are available?"
- Review the [development plan](../MAC_CONTROL_MCP_PLAN.md) for future features

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Review Claude Desktop logs
3. Verify permissions are granted
4. Ensure Node.js version is v20+
