#!/usr/bin/env node

import * as appTools from './build/tools/application.js';

async function openChrome() {
  console.log('🌐 Opening Google Chrome...\n');

  try {
    // Check if already running
    const status = await appTools.isAppRunning('Google Chrome');
    console.log('Status: ' + status);

    // Open/activate Chrome
    const result = await appTools.openApp('Google Chrome');
    console.log('→ ' + result);

    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

openChrome();
