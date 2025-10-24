#!/usr/bin/env node

// Interactive test - demonstrates actual control capabilities
import * as systemTools from './build/tools/system.js';
import * as appTools from './build/tools/application.js';

console.log('🎮 Mac Control MCP - Interactive Demo\n');
console.log('This will demonstrate actual control capabilities');
console.log('='.repeat(50) + '\n');

async function demo() {
  // Demo 1: Volume control
  console.log('📢 Demo 1: Volume Control');
  console.log('Getting current volume...');
  const currentVol = await systemTools.getVolume();
  console.log('  ' + currentVol);

  console.log('Setting volume to 25...');
  await systemTools.setVolume(25);
  console.log('  ✅ Volume set to 25%');

  await sleep(1000);

  console.log('Setting volume back to 50...');
  await systemTools.setVolume(50);
  console.log('  ✅ Volume restored to 50%\n');

  // Demo 2: Brightness
  console.log('💡 Demo 2: Brightness Control');
  console.log('Getting current brightness...');
  const currentBrightness = await systemTools.getBrightness();
  console.log('  ' + currentBrightness + '\n');

  // Demo 3: App management
  console.log('📱 Demo 3: Application Management');
  console.log('Checking which apps are running...');
  const runningApps = await appTools.listRunningApps();
  const appList = runningApps.split('\n').slice(0, 8).join('\n');
  console.log('  ' + appList + '\n  ...\n');

  // Demo 4: Check specific app
  console.log('🔍 Demo 4: Check Specific Apps');
  const finderStatus = await appTools.isAppRunning('Finder');
  console.log('  ' + finderStatus);

  const chromeStatus = await appTools.isAppRunning('Google Chrome');
  console.log('  ' + chromeStatus);

  const safariStatus = await appTools.isAppRunning('Safari');
  console.log('  ' + safariStatus + '\n');

  console.log('='.repeat(50));
  console.log('✨ Demo completed successfully!');
  console.log('\n💡 Tip: In Claude Desktop, you can just say:');
  console.log('   "Set volume to 30"');
  console.log('   "Open Safari"');
  console.log('   "List running apps"');
  console.log('   "Show battery status"\n');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

demo().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
