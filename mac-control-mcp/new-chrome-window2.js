#!/usr/bin/env node

import { executeShell } from './build/utils/shell.js';

async function newChromeWindow() {
  console.log('🌐 Opening a new Google Chrome window...\n');

  try {
    // Method 1: Use open command with -n flag (new instance)
    console.log('Attempting to open new Chrome window...');
    await executeShell('open -n -a "Google Chrome"', { allowDangerous: true });

    console.log('✅ New Chrome window opened successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

newChromeWindow();
