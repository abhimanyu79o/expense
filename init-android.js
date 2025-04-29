const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Android setup with Capacitor...');

// Step 1: Build the web app
console.log('\n📦 Building the web application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Initialize Android project
console.log('\n📱 Initializing Android project...');
try {
  execSync('npx cap add android', { stdio: 'inherit' });
  console.log('✅ Android project initialized!');
} catch (error) {
  console.error('❌ Android initialization failed:', error.message);
  process.exit(1);
}

// Step 3: Copy web assets to Android
console.log('\n🔄 Copying web assets to Android...');
try {
  execSync('npx cap copy android', { stdio: 'inherit' });
  console.log('✅ Assets copied to Android!');
} catch (error) {
  console.error('❌ Copying assets failed:', error.message);
  process.exit(1);
}

// Step 4: Open Android Studio
console.log('\n🛠️ Opening Android Studio...');
try {
  execSync('npx cap open android', { stdio: 'inherit' });
  console.log('✅ Android Studio opened!');
} catch (error) {
  console.error('❌ Failed to open Android Studio:', error.message);
  console.log('You can open the Android project manually from the "android" folder');
}

console.log('\n✨ Setup complete! Follow these next steps:');
console.log('1. In Android Studio, wait for the project to sync');
console.log('2. Click "Build" > "Build Bundle(s) / APK(s)" > "Build APK(s)"');
console.log('3. Once built, find the APK file in android/app/build/outputs/apk/debug/');

console.log('\n📝 Note: For production release, you should:');
console.log('1. Configure signing keys in Android Studio');
console.log('2. Build a release version instead of debug');
console.log('3. Test thoroughly on target devices');