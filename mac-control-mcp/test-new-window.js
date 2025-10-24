#!/usr/bin/env node

import * as appTools from './build/tools/application.js';

async function testNewWindow() {
  console.log('🧪 Testing open_new_window feature\n');

  // Test: Open new Chrome window
  console.log('📋 Test: Open new Chrome window');
  try {
    const result = await appTools.openNewWindow('Google Chrome');
    console.log('✅ ' + result);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n✨ Test completed!');
  console.log('\n💡 In Claude Desktop, you can now say:');
  console.log('   "Open a new Chrome window"');
  console.log('   "Open new window of Safari"');
}

testNewWindow();
