import { executeAppleScript } from '../utils/applescript.js';
import { executeShell } from '../utils/shell.js';

/**
 * Set system volume (0-100)
 */
export async function setVolume(level: number): Promise<string> {
  if (level < 0 || level > 100) {
    throw new Error('Volume level must be between 0 and 100');
  }

  await executeAppleScript(`set volume output volume ${level}`);
  return `Volume set to ${level}%`;
}

/**
 * Get current system volume
 */
export async function getVolume(): Promise<string> {
  const result = await executeAppleScript('output volume of (get volume settings)');
  return `Current volume: ${result}%`;
}

/**
 * Mute or unmute system audio
 */
export async function mute(muted: boolean): Promise<string> {
  await executeAppleScript(`set volume ${muted ? 'with' : 'without'} output muted`);
  return muted ? 'System muted' : 'System unmuted';
}

/**
 * Set display brightness (0-100)
 */
export async function setBrightness(level: number): Promise<string> {
  if (level < 0 || level > 100) {
    throw new Error('Brightness level must be between 0 and 100');
  }

  const normalized = level / 100;
  await executeAppleScript(
    `tell application "System Events" to tell appearance preferences to set brightness of displays to ${normalized}`
  );
  return `Brightness set to ${level}%`;
}

/**
 * Get current display brightness
 */
export async function getBrightness(): Promise<string> {
  const result = await executeAppleScript(
    'tell application "System Events" to tell appearance preferences to get brightness of displays'
  );
  const brightness = Math.round(parseFloat(result) * 100);
  return `Current brightness: ${brightness}%`;
}

/**
 * Put the computer to sleep
 */
export async function sleep(): Promise<string> {
  await executeAppleScript('tell application "System Events" to sleep');
  return 'Computer going to sleep';
}

/**
 * Restart the computer
 */
export async function restart(force: boolean = false): Promise<string> {
  const forceParam = force ? 'without' : 'with';
  await executeAppleScript(
    `tell application "System Events" to restart ${forceParam} showing dialog`
  );
  return 'Computer restarting...';
}

/**
 * Shutdown the computer
 */
export async function shutdown(force: boolean = false): Promise<string> {
  const forceParam = force ? 'without' : 'with';
  await executeAppleScript(
    `tell application "System Events" to shut down ${forceParam} showing dialog`
  );
  return 'Computer shutting down...';
}

/**
 * Get battery status
 */
export async function getBatteryStatus(): Promise<string> {
  try {
    const { stdout } = await executeShell('pmset -g batt', { allowDangerous: true });

    // Parse battery percentage
    const percentMatch = stdout.match(/(\d+)%/);
    const percent = percentMatch ? percentMatch[1] : 'unknown';

    // Check if charging
    const isCharging = stdout.includes('AC Power') || stdout.includes('charging');

    // Get time remaining if available
    const timeMatch = stdout.match(/(\d+:\d+)/);
    const timeRemaining = timeMatch ? timeMatch[1] : 'calculating';

    return `Battery: ${percent}%, ${isCharging ? 'Charging' : 'On Battery'}, Time remaining: ${timeRemaining}`;
  } catch (error) {
    throw new Error('Failed to get battery status. This device might not have a battery.');
  }
}

/**
 * Get system information
 */
export async function getSystemInfo(): Promise<string> {
  try {
    // Get CPU info
    const cpuInfo = await executeShell('sysctl -n machdep.cpu.brand_string', { allowDangerous: true });

    // Get memory info
    const memInfo = await executeShell('sysctl hw.memsize', { allowDangerous: true });
    const memBytes = parseInt(memInfo.stdout.split(':')[1].trim());
    const memGB = (memBytes / (1024 ** 3)).toFixed(2);

    // Get macOS version
    const osVersion = await executeShell('sw_vers -productVersion', { allowDangerous: true });

    // Get disk space
    const diskInfo = await executeShell('df -h / | tail -n 1', { allowDangerous: true });
    const diskParts = diskInfo.stdout.split(/\s+/);
    const diskSize = diskParts[1];
    const diskUsed = diskParts[2];
    const diskAvail = diskParts[3];
    const diskPercent = diskParts[4];

    return `System Information:
- macOS: ${osVersion.stdout}
- CPU: ${cpuInfo.stdout}
- Memory: ${memGB} GB
- Disk: ${diskUsed} used / ${diskSize} total (${diskPercent} used, ${diskAvail} available)`;
  } catch (error) {
    throw new Error('Failed to get system information');
  }
}
