#!/usr/bin/env node

import * as systemTools from './build/tools/system.js';

async function setVol() {
  console.log('🔊 Adjusting volume to 50%...\n');

  // Get current volume
  const current = await systemTools.getVolume();
  console.log('Current: ' + current);

  // Set to 50
  const result = await systemTools.setVolume(50);
  console.log('→ ' + result);

  // Verify
  const newVol = await systemTools.getVolume();
  console.log('Verified: ' + newVol);

  console.log('\n✅ Done!');
}

setVol().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
