import { executeAppleScript } from '../utils/applescript.js';
import { executeShell } from '../utils/shell.js';

/**
 * Open/launch an application
 */
export async function openApp(name: string): Promise<string> {
  if (!name || name.trim() === '') {
    throw new Error('Application name is required');
  }

  try {
    await executeAppleScript(`tell application "${name}" to activate`);
    return `Application "${name}" opened successfully`;
  } catch (error) {
    throw new Error(`Failed to open application "${name}". Make sure the application name is correct.`);
  }
}

/**
 * Open a new window/instance of an application
 */
export async function openNewWindow(name: string): Promise<string> {
  if (!name || name.trim() === '') {
    throw new Error('Application name is required');
  }

  try {
    // Use open -n to open a new instance
    await executeShell(`open -n -a "${name}"`, { allowDangerous: true });
    return `New window of "${name}" opened successfully`;
  } catch (error) {
    throw new Error(`Failed to open new window of "${name}". Make sure the application name is correct.`);
  }
}

/**
 * Close/quit an application
 */
export async function closeApp(name: string, force: boolean = false): Promise<string> {
  if (!name || name.trim() === '') {
    throw new Error('Application name is required');
  }

  try {
    if (force) {
      await executeAppleScript(
        `tell application "${name}" to quit`,
        { timeout: 2000 }
      );
    } else {
      await executeAppleScript(`tell application "${name}" to quit`);
    }
    return `Application "${name}" closed successfully`;
  } catch (error) {
    if (force) {
      // If force quit fails, try to kill the process
      throw new Error(`Failed to force quit application "${name}"`);
    }
    throw new Error(`Failed to close application "${name}". The application might not be running.`);
  }
}

/**
 * Get list of running applications
 */
export async function listRunningApps(): Promise<string> {
  try {
    const result = await executeAppleScript(
      'tell application "System Events" to get name of every process whose background only is false'
    );

    // Parse the comma-separated list
    const apps = result.split(', ').filter(app => app.trim() !== '');

    if (apps.length === 0) {
      return 'No running applications found';
    }

    return `Running applications (${apps.length}):\n${apps.map((app, i) => `${i + 1}. ${app}`).join('\n')}`;
  } catch (error) {
    throw new Error('Failed to get list of running applications');
  }
}

/**
 * Activate/switch to an application
 */
export async function activateApp(name: string): Promise<string> {
  if (!name || name.trim() === '') {
    throw new Error('Application name is required');
  }

  try {
    await executeAppleScript(`tell application "${name}" to activate`);
    return `Switched to application "${name}"`;
  } catch (error) {
    throw new Error(
      `Failed to activate application "${name}". ` +
      `The application might not be running or the name is incorrect.`
    );
  }
}

/**
 * Hide an application
 */
export async function hideApp(name: string): Promise<string> {
  if (!name || name.trim() === '') {
    throw new Error('Application name is required');
  }

  try {
    await executeAppleScript(
      `tell application "System Events" to set visible of process "${name}" to false`
    );
    return `Application "${name}" hidden`;
  } catch (error) {
    throw new Error(
      `Failed to hide application "${name}". ` +
      `The application might not be running.`
    );
  }
}

/**
 * Show/unhide an application
 */
export async function showApp(name: string): Promise<string> {
  if (!name || name.trim() === '') {
    throw new Error('Application name is required');
  }

  try {
    await executeAppleScript(
      `tell application "System Events" to set visible of process "${name}" to true`
    );
    return `Application "${name}" shown`;
  } catch (error) {
    throw new Error(
      `Failed to show application "${name}". ` +
      `The application might not be running.`
    );
  }
}

/**
 * Check if an application is running
 */
export async function isAppRunning(name: string): Promise<string> {
  if (!name || name.trim() === '') {
    throw new Error('Application name is required');
  }

  try {
    const result = await executeAppleScript(
      `tell application "System Events" to (name of processes) contains "${name}"`
    );
    const isRunning = result === 'true';
    return `Application "${name}" is ${isRunning ? 'running' : 'not running'}`;
  } catch (error) {
    throw new Error(`Failed to check if application "${name}" is running`);
  }
}
