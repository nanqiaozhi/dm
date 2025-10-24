#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Import tool modules
import * as systemTools from './tools/system.js';
import * as appTools from './tools/application.js';
import * as fileTools from './tools/file.js';

// Create server instance
const server = new Server(
  {
    name: "mac-control-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // System Control Tools (P0)
      {
        name: "set_volume",
        description: "Set system volume level (0-100)",
        inputSchema: {
          type: "object",
          properties: {
            level: {
              type: "number",
              description: "Volume level from 0 to 100",
              minimum: 0,
              maximum: 100,
            },
          },
          required: ["level"],
        },
      },
      {
        name: "get_volume",
        description: "Get current system volume level",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "mute",
        description: "Mute or unmute system audio",
        inputSchema: {
          type: "object",
          properties: {
            muted: {
              type: "boolean",
              description: "True to mute, false to unmute",
            },
          },
          required: ["muted"],
        },
      },
      {
        name: "set_brightness",
        description: "Set display brightness level (0-100)",
        inputSchema: {
          type: "object",
          properties: {
            level: {
              type: "number",
              description: "Brightness level from 0 to 100",
              minimum: 0,
              maximum: 100,
            },
          },
          required: ["level"],
        },
      },
      {
        name: "get_brightness",
        description: "Get current display brightness level",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_battery_status",
        description: "Get battery status and level",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_system_info",
        description: "Get system information (CPU, memory, disk, macOS version)",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },

      // Application Management Tools (P0)
      {
        name: "open_app",
        description: "Open/launch an application",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the application to open (e.g., 'Safari', 'Google Chrome')",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "close_app",
        description: "Close/quit an application",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the application to close",
            },
            force: {
              type: "boolean",
              description: "Force quit the application",
              default: false,
            },
          },
          required: ["name"],
        },
      },
      {
        name: "open_new_window",
        description: "Open a new window/instance of an application",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the application to open a new window for (e.g., 'Google Chrome', 'Safari')",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "list_running_apps",
        description: "List all currently running applications",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "activate_app",
        description: "Activate/switch to an application",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the application to activate",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "hide_app",
        description: "Hide an application",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the application to hide",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "is_app_running",
        description: "Check if an application is currently running",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the application to check",
            },
          },
          required: ["name"],
        },
      },

      // File Operations Tools (P0)
      {
        name: "open_file",
        description: "Open a file with default or specified application",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path to the file to open (supports ~ for home directory)",
            },
            app: {
              type: "string",
              description: "Optional: Name of application to open the file with",
            },
          },
          required: ["path"],
        },
      },
      {
        name: "open_folder",
        description: "Open a folder in Finder",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path to the folder to open (supports ~ for home directory)",
            },
          },
          required: ["path"],
        },
      },
      {
        name: "reveal_in_finder",
        description: "Reveal a file or folder in Finder",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path to the item to reveal (supports ~ for home directory)",
            },
          },
          required: ["path"],
        },
      },
      {
        name: "spotlight_search",
        description: "Search for files using Spotlight",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query",
            },
            limit: {
              type: "number",
              description: "Maximum number of results to return (default: 10)",
              default: 10,
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_file_info",
        description: "Get information about a file or folder",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path to the file or folder (supports ~ for home directory)",
            },
          },
          required: ["path"],
        },
      },
      {
        name: "move_to_trash",
        description: "Move a file or folder to trash",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path to the item to move to trash (supports ~ for home directory)",
            },
          },
          required: ["path"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: string;

    if (!args) {
      throw new Error('Missing arguments');
    }

    // System Control Tools
    switch (name) {
      case "set_volume":
        result = await systemTools.setVolume(args.level as number);
        break;
      case "get_volume":
        result = await systemTools.getVolume();
        break;
      case "mute":
        result = await systemTools.mute(args.muted as boolean);
        break;
      case "set_brightness":
        result = await systemTools.setBrightness(args.level as number);
        break;
      case "get_brightness":
        result = await systemTools.getBrightness();
        break;
      case "get_battery_status":
        result = await systemTools.getBatteryStatus();
        break;
      case "get_system_info":
        result = await systemTools.getSystemInfo();
        break;

      // Application Management Tools
      case "open_app":
        result = await appTools.openApp(args.name as string);
        break;
      case "close_app":
        result = await appTools.closeApp(args.name as string, args.force as boolean);
        break;
      case "open_new_window":
        result = await appTools.openNewWindow(args.name as string);
        break;
      case "list_running_apps":
        result = await appTools.listRunningApps();
        break;
      case "activate_app":
        result = await appTools.activateApp(args.name as string);
        break;
      case "hide_app":
        result = await appTools.hideApp(args.name as string);
        break;
      case "is_app_running":
        result = await appTools.isAppRunning(args.name as string);
        break;

      // File Operations Tools
      case "open_file":
        result = await fileTools.openFile(args.path as string, args.app as string);
        break;
      case "open_folder":
        result = await fileTools.openFolder(args.path as string);
        break;
      case "reveal_in_finder":
        result = await fileTools.revealInFinder(args.path as string);
        break;
      case "spotlight_search":
        result = await fileTools.spotlightSearch(
          args.query as string,
          (args.limit as number) || 10
        );
        break;
      case "get_file_info":
        result = await fileTools.getFileInfo(args.path as string);
        break;
      case "move_to_trash":
        result = await fileTools.moveToTrash(args.path as string);
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Mac Control MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
