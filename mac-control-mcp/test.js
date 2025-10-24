#!/usr/bin/env node

// Test script for Mac Control MCP Server
// This tests the underlying functions directly without MCP protocol

import * as systemTools from './build/tools/system.js';
import * as appTools from './build/tools/application.js';
import * as fileTools from './build/tools/file.js';

console.log('🧪 Mac Control MCP Server - Function Test\n');
console.log('='.repeat(50));

async function runTests() {
  // Test 1: Get System Volume
  console.log('\n📊 Test 1: Get System Volume');
  try {
    const result = await systemTools.getVolume();
    console.log('✅ Success:', result);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 2: Get System Info
  console.log('\n💻 Test 2: Get System Information');
  try {
    const result = await systemTools.getSystemInfo();
    console.log('✅ Success:\n' + result);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 3: Get Battery Status
  console.log('\n🔋 Test 3: Get Battery Status');
  try {
    const result = await systemTools.getBatteryStatus();
    console.log('✅ Success:', result);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 4: List Running Apps
  console.log('\n📱 Test 4: List Running Applications');
  try {
    const result = await appTools.listRunningApps();
    console.log('✅ Success:\n' + result);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 5: Check if Finder is running
  console.log('\n🔍 Test 5: Check if Finder is Running');
  try {
    const result = await appTools.isAppRunning('Finder');
    console.log('✅ Success:', result);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 6: Get Desktop folder info
  console.log('\n📁 Test 6: Get Desktop Folder Info');
  try {
    const result = await fileTools.getFileInfo('~/Desktop');
    console.log('✅ Success:\n' + result);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 7: Search for files
  console.log('\n🔎 Test 7: Spotlight Search for "test"');
  try {
    const result = await fileTools.spotlightSearch('test', 5);
    console.log('✅ Success:\n' + result);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✨ Test completed!\n');
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
