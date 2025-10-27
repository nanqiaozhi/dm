export interface ToolResult {
  content: Array<{
    type: "text" | "image" | "resource";
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

export interface AppleScriptOptions {
  timeout?: number;
  parseOutput?: boolean;
}

export interface ShellOptions {
  timeout?: number;
  cwd?: string;
  allowDangerous?: boolean;
}

export interface SystemInfo {
  cpuUsage: number;
  memoryUsage: number;
  diskSpace: {
    total: number;
    free: number;
    used: number;
  };
}

export interface BatteryStatus {
  isCharging: boolean;
  level: number;
  timeRemaining?: number;
}

export interface AppInfo {
  name: string;
  bundleId?: string;
  isActive: boolean;
  isHidden: boolean;
}

export interface WindowInfo {
  title: string;
  app: string;
  bounds: { x: number; y: number; width: number; height: number };
  isMinimized: boolean;
  isFullscreen: boolean;
}
