# Mac Control MCP Server

A Model Context Protocol (MCP) server that allows Claude Desktop to control macOS computers through AppleScript and shell commands.

## Features

### System Control
- Set and get system volume
- Mute/unmute audio
- Set and get display brightness
- Get battery status
- Get system information (CPU, memory, disk, macOS version)

### Application Management
- Open/launch applications
- Close/quit applications (with force option)
- List running applications
- Activate/switch to applications
- Hide applications
- Check if applications are running

### File Operations
- Open files with default or specified applications
- Open folders in Finder
- Reveal files/folders in Finder
- Search files using Spotlight
- Get file/folder information
- Move files/folders to trash

## Installation

### Prerequisites

- macOS 10.15 (Catalina) or later
- Node.js v20 or later
- Claude Desktop app

### Steps

1. Clone or download this repository:
```bash
git clone <repository-url>
cd mac-control-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Configuration

### Claude Desktop Setup

1. Open or create the Claude Desktop configuration file:
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

2. Add the mac-control server to the `mcpServers` section:
```json
{
  "mcpServers": {
    "mac-control": {
      "command": "node",
      "args": ["/absolute/path/to/mac-control-mcp/build/index.js"]
    }
  }
}
```

Replace `/absolute/path/to/mac-control-mcp` with the actual path to this project.

3. Restart Claude Desktop

## Permissions

macOS requires certain permissions for this MCP server to function properly:

### Required Permissions

1. **Accessibility (辅助功能)**
   - Path: System Settings > Privacy & Security > Accessibility
   - Add: `Claude` or `node`
   - Purpose: Control applications and system settings

2. **Automation (自动化)**
   - Path: System Settings > Privacy & Security > Automation
   - Allow: Claude/node to control other applications
   - Purpose: Control other applications via AppleScript

### Optional Permissions

3. **Full Disk Access (完全磁盘访问)** (if needed)
   - Path: System Settings > Privacy & Security > Full Disk Access
   - Add: `Claude` or `node`
   - Purpose: Access protected files and folders

## Usage Examples

Once configured, you can ask Claude to control your Mac:

### System Control
- "Set volume to 50%"
- "What's my current brightness level?"
- "Mute my audio"
- "Show me battery status"
- "Get system information"

### Application Management
- "Open Safari"
- "Close Google Chrome"
- "List all running applications"
- "Switch to Visual Studio Code"
- "Hide Slack"
- "Is Firefox running?"

### File Operations
- "Open ~/Documents/report.pdf"
- "Open ~/Downloads folder"
- "Reveal ~/Desktop/image.png in Finder"
- "Search for files containing 'budget'"
- "Show me info about ~/Documents/notes.txt"
- "Move ~/Desktop/old-file.txt to trash"

## Available Tools

### System Control (7 tools)
- `set_volume` - Set system volume (0-100)
- `get_volume` - Get current volume
- `mute` - Mute/unmute audio
- `set_brightness` - Set display brightness (0-100)
- `get_brightness` - Get current brightness
- `get_battery_status` - Get battery information
- `get_system_info` - Get system details

### Application Management (6 tools)
- `open_app` - Launch an application
- `close_app` - Quit an application
- `list_running_apps` - List running apps
- `activate_app` - Switch to an app
- `hide_app` - Hide an application
- `is_app_running` - Check if app is running

### File Operations (6 tools)
- `open_file` - Open a file
- `open_folder` - Open a folder in Finder
- `reveal_in_finder` - Reveal item in Finder
- `spotlight_search` - Search files with Spotlight
- `get_file_info` - Get file/folder details
- `move_to_trash` - Move item to trash

## Security

This MCP server includes several security features:

- **Command Whitelist**: Only approved shell commands can be executed
- **Path Sanitization**: File paths are sanitized to prevent injection attacks
- **Error Handling**: All operations include proper error handling
- **No Destructive Defaults**: Dangerous operations (force quit, restart, shutdown) are not enabled by default

## Troubleshooting

### Permission Errors
**Symptom**: Operations fail with permission denied errors

**Solution**:
1. Go to System Settings > Privacy & Security
2. Add Claude Desktop or node to Accessibility and Automation
3. Restart Claude Desktop

### Application Not Found
**Symptom**: "Failed to open application" errors

**Solution**: Use the complete application name exactly as it appears in the Applications folder. For example:
- Use "Google Chrome" not "Chrome"
- Use "Visual Studio Code" not "VSCode"
- Use "Microsoft Word" not "Word"

### MCP Server Not Connecting
**Symptom**: Claude Desktop doesn't recognize the tools

**Solution**:
1. Check that the path in `claude_desktop_config.json` is absolute and correct
2. Verify the build succeeded: `npm run build`
3. Check the build output exists: `ls build/index.js`
4. Restart Claude Desktop completely
5. Check Claude Desktop logs for errors

### File Not Found
**Symptom**: "File not found" when opening files

**Solution**:
- Use absolute paths or paths starting with `~` for home directory
- Check the file exists: `ls -la /path/to/file`
- Ensure proper permissions on the file

## Development

### Project Structure
```
mac-control-mcp/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── tools/                # Tool modules
│   │   ├── system.ts         # System control tools
│   │   ├── application.ts    # Application management tools
│   │   └── file.ts           # File operation tools
│   ├── utils/                # Utility modules
│   │   ├── applescript.ts    # AppleScript executor
│   │   └── shell.ts          # Shell command executor
│   └── types/                # TypeScript type definitions
│       └── index.ts
├── build/                    # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

### Build Commands
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development
- `npm run prepare` - Automatic build on install

### Adding New Tools

1. Create or update a tool module in `src/tools/`
2. Export the tool function
3. Register the tool in `src/index.ts`:
   - Add to `ListToolsRequestSchema` handler
   - Add case in `CallToolRequestSchema` handler
4. Rebuild: `npm run build`

## Version

**Current Version**: 0.1.0 (MVP - P0 Features)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## Changelog

### v0.1.0 (2025-10-24)
- Initial release with P0 features
- System control tools (volume, brightness, battery, system info)
- Application management tools (open, close, list, activate, hide)
- File operation tools (open, reveal, search, info, trash)
