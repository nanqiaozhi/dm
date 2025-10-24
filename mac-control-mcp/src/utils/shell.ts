import { exec } from 'child_process';
import { promisify } from 'util';
import { ShellOptions } from '../types/index.js';

const execAsync = promisify(exec);

// Whitelist of allowed commands for security
const ALLOWED_COMMANDS = [
  'open',
  'screencapture',
  'pbpaste',
  'pbcopy',
  'mdfind',
  'defaults',
  'brightness',
  'pmset',
  'osascript'
];

/**
 * Check if a command is allowed to be executed
 * @param command - The command to check
 * @returns True if the command is allowed
 */
export function isCommandAllowed(command: string): boolean {
  const commandName = command.trim().split(' ')[0];
  return ALLOWED_COMMANDS.includes(commandName);
}

/**
 * Sanitize a file path to prevent command injection
 * @param path - The path to sanitize
 * @returns The sanitized path
 */
export function sanitizePath(path: string): string {
  // Remove potentially dangerous characters
  return path.replace(/[;&|`$()]/g, '');
}

/**
 * Execute a shell command
 * @param command - The command to execute
 * @param options - Execution options
 * @returns Object containing stdout and stderr
 */
export async function executeShell(
  command: string,
  options: ShellOptions = {}
): Promise<{ stdout: string; stderr: string }> {
  const { timeout = 10000, cwd, allowDangerous = false } = options;

  // Check if command is allowed (unless dangerous commands are explicitly allowed)
  if (!allowDangerous && !isCommandAllowed(command)) {
    throw new Error(
      `Command not allowed: ${command.split(' ')[0]}. ` +
      `Allowed commands: ${ALLOWED_COMMANDS.join(', ')}`
    );
  }

  try {
    const { stdout, stderr } = await execAsync(command, {
      timeout,
      cwd,
      encoding: 'utf8'
    });

    return { stdout: stdout.trim(), stderr: stderr.trim() };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to execute command: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Execute a shell command and return only stdout
 * @param command - The command to execute
 * @param options - Execution options
 * @returns The stdout output
 */
export async function executeShellSimple(
  command: string,
  options: ShellOptions = {}
): Promise<string> {
  const { stdout } = await executeShell(command, options);
  return stdout;
}
