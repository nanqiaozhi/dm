#!/usr/bin/env node

import { executeAppleScript } from './build/utils/applescript.js';

async function newChromeWindow() {
  console.log('🌐 Opening a new Google Chrome window...\n');

  try {
    // Open a new Chrome window using AppleScript
    const script = `
      tell application "Google Chrome"
        activate
        make new window
      end tell
    `;

    await executeAppleScript(script);
    console.log('✅ New Chrome window opened successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

newChromeWindow();
