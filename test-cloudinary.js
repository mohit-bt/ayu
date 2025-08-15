const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Cloudinary Config:');
console.log('- Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('- API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
console.log('- API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set');

// Test connection
console.log('\nTesting Cloudinary connection...');
cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary connection successful!');
    console.log('Result:', result);
  })
  .catch(error => {
    console.error('❌ Cloudinary connection failed:');
    console.error('Error:', error.message);
    console.error('Full error:', error);
  });
