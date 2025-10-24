#!/usr/bin/env node

// Safe demo - only tests features that work reliably
import * as systemTools from './build/tools/system.js';
import * as appTools from './build/tools/application.js';
import * as fileTools from './build/tools/file.js';

console.log('🎮 Mac Control MCP - Live Demo\n');
console.log('='.repeat(60) + '\n');

async function demo() {
  // Demo 1: System Info
  console.log('💻 System Information:');
  console.log('-'.repeat(60));
  try {
    const info = await systemTools.getSystemInfo();
    console.log(info + '\n');
  } catch (error) {
    console.log('❌ Error:', error.message + '\n');
  }

  // Demo 2: Battery Status
  console.log('🔋 Battery Status:');
  console.log('-'.repeat(60));
  try {
    const battery = await systemTools.getBatteryStatus();
    console.log(battery + '\n');
  } catch (error) {
    console.log('❌ Error:', error.message + '\n');
  }

  // Demo 3: Volume Control (actual change!)
  console.log('🔊 Volume Control Demo:');
  console.log('-'.repeat(60));
  try {
    const vol1 = await systemTools.getVolume();
    console.log('Current: ' + vol1);

    console.log('→ Setting volume to 30%...');
    await systemTools.setVolume(30);
    await sleep(500);

    const vol2 = await systemTools.getVolume();
    console.log('New: ' + vol2);

    console.log('→ Restoring volume to 50%...');
    await systemTools.setVolume(50);
    await sleep(500);

    const vol3 = await systemTools.getVolume();
    console.log('Final: ' + vol3 + '\n');
  } catch (error) {
    console.log('❌ Error:', error.message + '\n');
  }

  // Demo 4: Running Applications
  console.log('📱 Running Applications:');
  console.log('-'.repeat(60));
  try {
    const apps = await appTools.listRunningApps();
    const lines = apps.split('\n');
    console.log(lines.slice(0, 11).join('\n'));
    if (lines.length > 11) {
      console.log('   ... and ' + (lines.length - 11) + ' more');
    }
    console.log('');
  } catch (error) {
    console.log('❌ Error:', error.message + '\n');
  }

  // Demo 5: Check Specific Apps
  console.log('🔍 Check Specific Applications:');
  console.log('-'.repeat(60));
  const appsToCheck = ['Finder', 'Google Chrome', 'Safari', 'Terminal', 'Visual Studio Code'];

  for (const app of appsToCheck) {
    try {
      const status = await appTools.isAppRunning(app);
      console.log('  ' + status);
    } catch (error) {
      console.log('  ❌ Error checking ' + app);
    }
  }
  console.log('');

  // Demo 6: File Operations
  console.log('📁 File Operations:');
  console.log('-'.repeat(60));
  try {
    const desktopInfo = await fileTools.getFileInfo('~/Desktop');
    console.log(desktopInfo + '\n');
  } catch (error) {
    console.log('❌ Error:', error.message + '\n');
  }

  // Demo 7: Spotlight Search
  console.log('🔎 Spotlight Search (searching for "download"):');
  console.log('-'.repeat(60));
  try {
    const searchResults = await fileTools.spotlightSearch('download', 5);
    console.log(searchResults + '\n');
  } catch (error) {
    console.log('❌ Error:', error.message + '\n');
  }

  console.log('='.repeat(60));
  console.log('✅ Demo completed!\n');
  console.log('💡 All these functions are available in Claude Desktop as MCP tools.');
  console.log('   Just ask naturally, like:');
  console.log('   • "What\'s my battery status?"');
  console.log('   • "Set volume to 40"');
  console.log('   • "Open Safari"');
  console.log('   • "List running apps"');
  console.log('   • "Search for files with \'meeting\' in the name"\n');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

demo().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
