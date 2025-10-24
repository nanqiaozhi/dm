import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { AppleScriptOptions } from '../types/index.js';

const execAsync = promisify(exec);

/**
 * Execute an AppleScript command
 * @param script - The AppleScript code to execute
 * @param options - Execution options
 * @returns The output from the script
 */
export async function executeAppleScript(
  script: string,
  options: AppleScriptOptions = {}
): Promise<string> {
  const { timeout = 5000, parseOutput = true } = options;

  try {
    const { stdout, stderr } = await execAsync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, {
      timeout,
      encoding: 'utf8'
    });

    if (stderr) {
      throw new Error(`AppleScript error: ${stderr}`);
    }

    return parseOutput ? stdout.trim() : stdout;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to execute AppleScript: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Build an AppleScript string from a template with variable substitution
 * @param template - The script template
 * @param vars - Variables to substitute
 * @returns The complete script
 */
export function buildAppleScript(template: string, vars: Record<string, any>): string {
  let script = template;
  for (const [key, value] of Object.entries(vars)) {
    const placeholder = `\${${key}}`;
    script = script.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value));
  }
  return script;
}

/**
 * Execute a multi-line AppleScript
 * @param scriptLines - Array of script lines
 * @param options - Execution options
 * @returns The output from the script
 */
export async function executeMultiLineAppleScript(
  scriptLines: string[],
  options: AppleScriptOptions = {}
): Promise<string> {
  const script = scriptLines.join('\n');
  const { timeout = 5000 } = options;

  return new Promise((resolve, reject) => {
    const child = spawn('osascript', ['-']);
    let stdout = '';
    let stderr = '';

    const timer = setTimeout(() => {
      child.kill();
      reject(new Error('AppleScript execution timed out'));
    }, timeout);

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(`AppleScript error: ${stderr}`));
      } else {
        resolve(stdout.trim());
      }
    });

    child.on('error', (error) => {
      clearTimeout(timer);
      reject(new Error(`Failed to execute AppleScript: ${error.message}`));
    });

    // Write the script to stdin
    child.stdin.write(script);
    child.stdin.end();
  });
}
