import { executeAppleScript } from '../utils/applescript.js';
import { executeShell, sanitizePath } from '../utils/shell.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Open a file with default or specified application
 */
export async function openFile(filePath: string, appName?: string): Promise<string> {
  if (!filePath || filePath.trim() === '') {
    throw new Error('File path is required');
  }

  // Expand tilde to home directory
  const expandedPath = filePath.startsWith('~')
    ? filePath.replace('~', process.env.HOME || '')
    : filePath;

  // Check if file exists
  if (!fs.existsSync(expandedPath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  try {
    if (appName) {
      await executeShell(`open -a "${appName}" "${sanitizePath(expandedPath)}"`);
      return `Opened "${filePath}" with ${appName}`;
    } else {
      await executeShell(`open "${sanitizePath(expandedPath)}"`);
      return `Opened "${filePath}"`;
    }
  } catch (error) {
    throw new Error(`Failed to open file: ${filePath}`);
  }
}

/**
 * Open a folder in Finder
 */
export async function openFolder(folderPath: string): Promise<string> {
  if (!folderPath || folderPath.trim() === '') {
    throw new Error('Folder path is required');
  }

  // Expand tilde to home directory
  const expandedPath = folderPath.startsWith('~')
    ? folderPath.replace('~', process.env.HOME || '')
    : folderPath;

  // Check if folder exists
  if (!fs.existsSync(expandedPath)) {
    throw new Error(`Folder not found: ${folderPath}`);
  }

  if (!fs.statSync(expandedPath).isDirectory()) {
    throw new Error(`Path is not a folder: ${folderPath}`);
  }

  try {
    await executeShell(`open "${sanitizePath(expandedPath)}"`);
    return `Opened folder "${folderPath}" in Finder`;
  } catch (error) {
    throw new Error(`Failed to open folder: ${folderPath}`);
  }
}

/**
 * Reveal a file or folder in Finder
 */
export async function revealInFinder(itemPath: string): Promise<string> {
  if (!itemPath || itemPath.trim() === '') {
    throw new Error('Item path is required');
  }

  // Expand tilde to home directory
  const expandedPath = itemPath.startsWith('~')
    ? itemPath.replace('~', process.env.HOME || '')
    : itemPath;

  // Check if item exists
  if (!fs.existsSync(expandedPath)) {
    throw new Error(`Item not found: ${itemPath}`);
  }

  try {
    await executeAppleScript(`tell application "Finder" to reveal POSIX file "${expandedPath}"`);
    await executeAppleScript('tell application "Finder" to activate');
    return `Revealed "${itemPath}" in Finder`;
  } catch (error) {
    throw new Error(`Failed to reveal in Finder: ${itemPath}`);
  }
}

/**
 * Search for files using Spotlight
 */
export async function spotlightSearch(query: string, limit: number = 10): Promise<string> {
  if (!query || query.trim() === '') {
    throw new Error('Search query is required');
  }

  try {
    const { stdout } = await executeShell(`mdfind "${query}" | head -n ${limit}`);

    if (!stdout || stdout.trim() === '') {
      return `No results found for: "${query}"`;
    }

    const results = stdout.split('\n').filter(line => line.trim() !== '');
    return `Found ${results.length} results for "${query}":\n${results.map((r, i) => `${i + 1}. ${r}`).join('\n')}`;
  } catch (error) {
    throw new Error(`Failed to search for: ${query}`);
  }
}

/**
 * Get file or folder information
 */
export async function getFileInfo(itemPath: string): Promise<string> {
  if (!itemPath || itemPath.trim() === '') {
    throw new Error('Item path is required');
  }

  // Expand tilde to home directory
  const expandedPath = itemPath.startsWith('~')
    ? itemPath.replace('~', process.env.HOME || '')
    : itemPath;

  // Check if item exists
  if (!fs.existsSync(expandedPath)) {
    throw new Error(`Item not found: ${itemPath}`);
  }

  try {
    const stats = fs.statSync(expandedPath);
    const itemType = stats.isDirectory() ? 'Directory' : 'File';
    const size = stats.isFile() ? `${(stats.size / 1024).toFixed(2)} KB` : 'N/A';
    const created = stats.birthtime.toLocaleString();
    const modified = stats.mtime.toLocaleString();
    const baseName = path.basename(expandedPath);

    return `File Information for "${baseName}":
- Type: ${itemType}
- Size: ${size}
- Created: ${created}
- Modified: ${modified}
- Full Path: ${expandedPath}`;
  } catch (error) {
    throw new Error(`Failed to get file info: ${itemPath}`);
  }
}

/**
 * Move a file or folder to trash
 */
export async function moveToTrash(itemPath: string): Promise<string> {
  if (!itemPath || itemPath.trim() === '') {
    throw new Error('Item path is required');
  }

  // Expand tilde to home directory
  const expandedPath = itemPath.startsWith('~')
    ? itemPath.replace('~', process.env.HOME || '')
    : itemPath;

  // Check if item exists
  if (!fs.existsSync(expandedPath)) {
    throw new Error(`Item not found: ${itemPath}`);
  }

  try {
    await executeAppleScript(
      `tell application "Finder" to delete (POSIX file "${expandedPath}" as alias)`
    );
    return `Moved "${itemPath}" to trash`;
  } catch (error) {
    throw new Error(`Failed to move to trash: ${itemPath}`);
  }
}
