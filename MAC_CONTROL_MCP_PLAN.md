# Mac 控制 MCP 开发计划

## 项目概述

创建一个基于 TypeScript/Node.js 的 MCP (Model Context Protocol) 服务器，用于通过 Claude 控制 Mac 电脑的各种功能。

**项目名称：** mac-control-mcp
**技术栈：** TypeScript, Node.js, MCP SDK, AppleScript
**目标用户：** Claude Desktop 用户
**预计开发时间：** 9-14 小时

## 核心功能模块

### 1. 系统控制模块
- 音量控制（设置、静音、获取）
- 亮度控制（设置、获取）
- 电源管理（睡眠、重启、关机）
- 系统信息（电池、CPU、内存、磁盘）

### 2. 应用管理模块
- 启动/关闭应用程序
- 获取运行中应用列表
- 应用切换与激活
- 隐藏/显示应用

### 3. 窗口管理模块
- 窗口最小化/最大化/全屏
- 窗口位置和大小调整
- 多窗口排列（分屏）
- 获取活动窗口信息

### 4. 文件操作模块
- 打开文件/文件夹
- Finder 操作
- Spotlight 搜索
- 文件信息获取
- 移动到废纸篓

### 5. 自动化任务模块
- 截图（全屏/窗口/选区）
- 剪贴板操作
- 系统通知
- 文本转语音
- Shell 命令执行

## 开发阶段

### 阶段 1：项目初始化（1-2 小时）

**任务清单：**
- [ ] 创建项目目录结构
- [ ] 初始化 npm 项目
- [ ] 安装依赖包
- [ ] 配置 TypeScript
- [ ] 创建 MCP 服务器入口
- [ ] 实现工具注册框架

**目录结构：**
```
mac-control-mcp/
├── src/
│   ├── index.ts              # MCP 服务器入口
│   ├── tools/                # 工具模块目录
│   │   ├── system.ts         # 系统控制
│   │   ├── application.ts    # 应用管理
│   │   ├── window.ts         # 窗口管理
│   │   ├── file.ts           # 文件操作
│   │   └── automation.ts     # 自动化任务
│   ├── utils/                # 工具类目录
│   │   ├── applescript.ts    # AppleScript 执行器
│   │   └── shell.ts          # Shell 命令执行器
│   └── types/                # 类型定义
│       └── index.ts
├── build/                    # 编译输出目录
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

**依赖配置：**
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.6.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 阶段 2：核心工具模块开发（4-6 小时）

#### 2.1 系统控制模块（P0）

**工具列表：**

| 工具名称 | 描述 | 参数 | 优先级 |
|---------|------|------|--------|
| `set_volume` | 设置系统音量 | level: 0-100 | P0 |
| `get_volume` | 获取当前音量 | 无 | P0 |
| `mute` | 静音/取消静音 | muted: boolean | P0 |
| `set_brightness` | 设置屏幕亮度 | level: 0-100 | P0 |
| `get_brightness` | 获取当前亮度 | 无 | P1 |
| `sleep` | 电脑睡眠 | 无 | P1 |
| `restart` | 重启电脑 | force: boolean | P1 |
| `shutdown` | 关机 | force: boolean | P1 |
| `get_battery_status` | 获取电池状态 | 无 | P1 |
| `get_system_info` | 获取系统信息 | 无 | P1 |

**实现方式：**
```typescript
// AppleScript 示例
set_volume: `set volume output volume ${level}`
get_volume: `output volume of (get volume settings)`
set_brightness: `tell application "System Events" to set brightness of displays to ${level/100}`
```

#### 2.2 应用管理模块（P0）

**工具列表：**

| 工具名称 | 描述 | 参数 | 优先级 |
|---------|------|------|--------|
| `open_app` | 启动应用程序 | name: string | P0 |
| `close_app` | 关闭应用程序 | name: string, force?: boolean | P0 |
| `list_running_apps` | 列出运行中的应用 | 无 | P0 |
| `activate_app` | 激活/切换到应用 | name: string | P0 |
| `hide_app` | 隐藏应用 | name: string | P1 |
| `quit_all_apps` | 退出所有应用（除系统应用） | exclude?: string[] | P2 |

**实现方式：**
```typescript
open_app: `tell application "${name}" to activate`
close_app: `tell application "${name}" to quit`
list_running_apps: `tell application "System Events" to get name of every process whose background only is false`
```

#### 2.3 窗口管理模块（P1）

**工具列表：**

| 工具名称 | 描述 | 参数 | 优先级 |
|---------|------|------|--------|
| `minimize_window` | 最小化当前窗口 | app?: string | P1 |
| `maximize_window` | 最大化窗口 | app?: string | P1 |
| `fullscreen_toggle` | 全屏切换 | app?: string | P1 |
| `set_window_bounds` | 设置窗口位置和大小 | x, y, width, height | P1 |
| `split_screen_left` | 窗口左半屏 | app: string | P2 |
| `split_screen_right` | 窗口右半屏 | app: string | P2 |
| `get_active_window` | 获取活动窗口信息 | 无 | P1 |

#### 2.4 文件操作模块（P0-P1）

**工具列表：**

| 工具名称 | 描述 | 参数 | 优先级 |
|---------|------|------|--------|
| `open_file` | 打开文件 | path: string, app?: string | P0 |
| `open_folder` | 打开文件夹 | path: string | P0 |
| `reveal_in_finder` | 在 Finder 中显示 | path: string | P0 |
| `spotlight_search` | Spotlight 搜索 | query: string | P1 |
| `get_file_info` | 获取文件信息 | path: string | P1 |
| `move_to_trash` | 移动到废纸篓 | path: string | P1 |

**实现方式：**
```typescript
open_file: `open "${path}"` 或 `open -a "${app}" "${path}"`
reveal_in_finder: `tell application "Finder" to reveal POSIX file "${path}"`
spotlight_search: `mdfind "${query}"`
```

#### 2.5 自动化任务模块（P1）

**工具列表：**

| 工具名称 | 描述 | 参数 | 优先级 |
|---------|------|------|--------|
| `take_screenshot` | 截图 | type: 'fullscreen'\|'window'\|'selection', path?: string | P1 |
| `get_clipboard` | 获取剪贴板内容 | 无 | P1 |
| `set_clipboard` | 设置剪贴板内容 | text: string | P1 |
| `send_notification` | 发送系统通知 | title: string, message: string | P1 |
| `speak_text` | 文本转语音 | text: string, voice?: string | P2 |
| `execute_command` | 执行 Shell 命令 | command: string | P2 |

**实现方式：**
```typescript
take_screenshot: `screencapture -x ${path}` (全屏)
                 `screencapture -i ${path}` (选区)
get_clipboard: `pbpaste`
set_clipboard: `echo "${text}" | pbcopy`
send_notification: `osascript -e 'display notification "${message}" with title "${title}"'`
```

### 阶段 3：工具类开发（1-2 小时）

#### 3.1 AppleScript 执行器

**功能：**
- 执行 AppleScript 脚本
- 错误捕获和处理
- 结果解析（字符串、数字、列表）
- 超时控制

**接口设计：**
```typescript
export interface AppleScriptOptions {
  timeout?: number;
  parseOutput?: boolean;
}

export async function executeAppleScript(
  script: string,
  options?: AppleScriptOptions
): Promise<string>

export function buildAppleScript(template: string, vars: Record<string, any>): string
```

#### 3.2 Shell 命令执行器

**功能：**
- 执行 shell 命令
- 命令白名单验证
- 超时和错误处理
- 输出流处理

**接口设计：**
```typescript
export interface ShellOptions {
  timeout?: number;
  cwd?: string;
  allowDangerous?: boolean;
}

export async function executeShell(
  command: string,
  options?: ShellOptions
): Promise<{ stdout: string; stderr: string }>

export function isCommandAllowed(command: string): boolean
```

#### 3.3 类型定义

**主要类型：**
```typescript
export interface ToolResult {
  content: Array<{
    type: "text" | "image" | "resource";
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
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
```

### 阶段 4：增强功能（2-3 小时）

#### 4.1 配置文件支持

**配置项：**
```json
{
  "security": {
    "allowDangerousCommands": false,
    "commandWhitelist": ["open", "screencapture", "pbpaste", "pbcopy"],
    "requireConfirmation": ["restart", "shutdown", "quit_all_apps"]
  },
  "defaults": {
    "screenshotPath": "~/Desktop",
    "screenshotFormat": "png"
  },
  "logging": {
    "enabled": true,
    "logPath": "~/.mac-control-mcp/logs",
    "logLevel": "info"
  }
}
```

#### 4.2 错误处理机制

**错误类型：**
- `PermissionError`: 权限不足
- `ApplicationNotFoundError`: 应用未找到
- `CommandNotAllowedError`: 命令不允许
- `ExecutionError`: 执行失败
- `TimeoutError`: 超时

**错误响应格式：**
```typescript
{
  content: [{
    type: "text",
    text: "错误信息：描述 + 解决建议"
  }],
  isError: true
}
```

#### 4.3 日志记录

**日志内容：**
- 工具调用时间
- 工具名称和参数
- 执行结果（成功/失败）
- 错误信息
- 执行耗时

#### 4.4 安全机制

**实现：**
- 命令白名单/黑名单
- 危险操作确认机制
- 路径访问限制
- 参数验证和清理

### 阶段 5：测试与文档（1-2 小时）

#### 5.1 README.md

**内容包含：**
- 项目简介
- 功能特性列表
- 安装步骤
- 配置方法
- 权限设置指南
- 使用示例
- 故障排查
- 常见问题

#### 5.2 权限设置指南

**必需权限：**
1. **辅助功能 (Accessibility)**
   - 路径：系统设置 > 隐私与安全性 > 辅助功能
   - 用途：控制应用和窗口

2. **自动化 (Automation)**
   - 路径：系统设置 > 隐私与安全性 > 自动化
   - 用途：控制其他应用

3. **完全磁盘访问 (可选)**
   - 路径：系统设置 > 隐私与安全性 > 完全磁盘访问
   - 用途：访问受保护的文件

#### 5.3 测试清单

**功能测试：**
- [ ] 所有 P0 工具正常工作
- [ ] 错误处理正确
- [ ] 权限不足时有友好提示
- [ ] 配置文件加载正确
- [ ] 日志记录正常
- [ ] Claude Desktop 集成成功

### 阶段 6：打包与部署（1 小时）

#### 6.1 构建配置

**package.json scripts:**
```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "prepare": "npm run build",
    "test": "echo \"No tests yet\""
  }
}
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build"]
}
```

#### 6.2 Claude Desktop 配置

**配置文件位置：**
`~/.claude/claude_desktop_config.json`

**配置内容：**
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

#### 6.3 安装脚本

**install.sh:**
```bash
#!/bin/bash
npm install
npm run build
echo "安装完成！请配置 Claude Desktop..."
```

## 优先级定义

### P0 - 必须实现（核心功能）
- 项目基础架构
- 系统控制：音量、亮度
- 应用管理：启动、关闭、列表
- 文件操作：打开文件/文件夹、Finder 显示

### P1 - 重要功能
- 窗口管理
- 截图和剪贴板
- 系统信息获取
- 通知发送
- 错误处理和日志

### P2 - 增强功能
- 高级窗口排列
- 文件搜索
- TTS 功能
- 配置文件支持
- Shell 命令执行

## 技术实现要点

### AppleScript 最佳实践

1. **错误处理：**
```applescript
try
    tell application "App Name"
        -- 操作
    end tell
on error errMsg
    return "Error: " & errMsg
end try
```

2. **超时控制：**
```typescript
const timeout = setTimeout(() => {
  process.kill(childProcess.pid);
}, 5000);
```

3. **输出解析：**
- 字符串：直接返回
- 列表：按行分割
- 数字：parseInt/parseFloat

### Shell 命令安全

1. **白名单命令：**
```typescript
const ALLOWED_COMMANDS = [
  'open', 'screencapture', 'pbpaste', 'pbcopy',
  'mdfind', 'defaults', 'brightness'
];
```

2. **参数清理：**
```typescript
function sanitizePath(path: string): string {
  // 移除危险字符
  return path.replace(/[;&|`$()]/g, '');
}
```

3. **路径验证：**
```typescript
function isValidPath(path: string): boolean {
  // 检查路径是否存在且安全
  return fs.existsSync(path) && !path.includes('..');
}
```

## 性能优化

1. **异步执行：** 使用 `async/await` 避免阻塞
2. **超时控制：** 所有操作设置合理超时
3. **缓存：** 缓存应用列表等频繁查询的数据
4. **并发控制：** 限制同时执行的命令数量

## 兼容性考虑

### macOS 版本支持
- **最低版本：** macOS 10.15 (Catalina)
- **推荐版本：** macOS 12+ (Monterey 及以上)
- **注意事项：** 某些 API 在不同版本表现不同

### Apple Silicon 兼容性
- Node.js 使用原生 ARM64 版本
- AppleScript 和 Shell 命令完全兼容

## 安全注意事项

### 高风险操作
1. **系统电源控制：** 重启、关机
2. **批量应用退出：** quit_all_apps
3. **Shell 命令执行：** execute_command
4. **文件删除：** move_to_trash

### 防护措施
1. 默认禁用危险操作
2. 需要用户在配置中明确启用
3. 执行前发送警告信息
4. 记录所有操作日志

## 故障排查指南

### 常见问题

**1. 权限错误**
- 症状：操作失败，提示权限不足
- 解决：检查系统设置中的辅助功能和自动化权限

**2. 应用未找到**
- 症状：提示应用不存在
- 解决：使用完整应用名称（如 "Google Chrome" 而非 "Chrome"）

**3. MCP 服务器无法启动**
- 症状：Claude Desktop 无法连接
- 解决：检查路径配置、Node.js 版本、构建是否成功

**4. AppleScript 超时**
- 症状：操作卡住不响应
- 解决：检查应用是否有弹窗阻塞、增加超时时间

## 未来扩展方向

### 短期（1-3 个月）
- 添加更多应用特定操作（浏览器控制、音乐播放器等）
- 实现宏/脚本功能（组合多个操作）
- 支持快捷键模拟

### 中期（3-6 个月）
- 支持多显示器管理
- 网络设置控制（WiFi、VPN）
- 蓝牙设备管理
- 计划任务功能

### 长期（6-12 个月）
- GUI 配置工具
- 操作录制和回放
- 与其他 MCP 服务器集成
- 云同步配置

## 参考资源

### 官方文档
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [AppleScript Language Guide](https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/)
- [macOS Automation](https://developer.apple.com/macos/automation/)

### 工具和库
- [osascript](https://ss64.com/osx/osascript.html) - AppleScript 命令行工具
- [screencapture](https://ss64.com/osx/screencapture.html) - 截图工具
- [mdfind](https://ss64.com/osx/mdfind.html) - Spotlight 搜索

### 社区资源
- [MCP Servers GitHub](https://github.com/modelcontextprotocol/servers)
- [Mac Automation Scripting Guide](https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/)

## 开发检查清单

### 启动前
- [ ] Node.js v20+ 已安装
- [ ] npm 已配置
- [ ] 了解 MCP 协议基础
- [ ] 熟悉 AppleScript 基本语法

### 开发中
- [ ] 每个工具都有完整的类型定义
- [ ] 所有错误都有友好的提示信息
- [ ] 危险操作有警告和确认
- [ ] 代码有适当的注释
- [ ] 遵循 TypeScript 最佳实践

### 发布前
- [ ] 所有 P0 功能测试通过
- [ ] README 完整准确
- [ ] 示例配置文件已创建
- [ ] 权限设置指南清晰
- [ ] 在干净环境测试安装流程
- [ ] 代码已格式化

## 版本规划

### v0.1.0 - MVP（最小可用版本）
- 基础架构
- P0 功能
- 基本错误处理

### v0.2.0 - 功能完善
- 所有 P1 功能
- 配置文件支持
- 完整文档

### v0.3.0 - 增强版
- P2 功能
- 性能优化
- 高级特性

### v1.0.0 - 正式版
- 生产就绪
- 完整测试
- 社区反馈整合

---

**文档版本：** 1.0
**创建日期：** 2025-10-24
**最后更新：** 2025-10-24
