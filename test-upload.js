const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { ImgurClient } = require('imgur');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Initialize Imgur clients - testing both approaches
// Initialize Imgur client for anonymous uploads (same as server.js)
const imgurClient = new ImgurClient();

// Test function
async function testUploads() {
  console.log('🧪 Testing Cloud Upload Services...\n');

  // Test Cloudinary
  console.log('1️⃣ Testing Cloudinary connection...');
  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary: Connected successfully');
    console.log('   Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
  } catch (error) {
    console.log('❌ Cloudinary: Connection failed -', error.message || 'Unknown error');
    console.log('   Error code:', error.error?.code || 'No error code');
    console.log('   This may indicate invalid credentials or network issues');
    console.log('   The server will automatically fall back to Imgur for uploads');
  }

  // Test Cloudinary upload even if ping fails
  console.log('\n📤 Testing Cloudinary upload...');
  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    const uploadResult = await cloudinary.uploader.upload(testImage, {
      folder: 'test-uploads',
      resource_type: 'image',
      format: 'png'
    });
    
    console.log('✅ Cloudinary: Upload successful -', uploadResult.secure_url);
  } catch (error) {
    console.log('❌ Cloudinary: Upload failed -', error.message);
    console.log('   This confirms the network/connectivity issue');
  }

  // Test Imgur with Client ID
  console.log('\n2️⃣ Testing Imgur upload (with Client ID)...');
  try {
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    const response = await imgurClient.upload({
      image: testImage,
      type: 'base64',
      title: 'Test Upload',
      description: 'Testing Imgur upload functionality'
    });
    
    if (response.success && response.data && response.data.link) {
      console.log('✅ Imgur (with ID): Upload successful -', response.data.link);
    } else {
      console.log('❌ Imgur (with ID): Upload failed');
      console.log('   Response:', JSON.stringify(response, null, 2));
    }
  } catch (error) {
    console.log('❌ Imgur (with ID): Upload failed -', error.message);
  }

  // Test Imgur Anonymous (like server.js)
  console.log('\n3️⃣ Testing Imgur upload (anonymous, like server.js)...');
  try {
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    const response = await imgurAnonymous.upload({
      image: testImage,
      type: 'base64',
      title: 'Test Upload Anonymous',
      description: 'Testing Imgur anonymous upload'
    });
    
    if (response.success && response.data && response.data.link) {
      console.log('✅ Imgur (anonymous): Upload successful -', response.data.link);
    } else {
      console.log('❌ Imgur (anonymous): Upload failed');
      console.log('   Response:', JSON.stringify(response, null, 2));
    }
  } catch (error) {
    console.log('❌ Imgur (anonymous): Upload failed -', error.message);
  }

  console.log('\n🎯 Upload service test completed!\n');
}

testUploads().catch(console.error);
