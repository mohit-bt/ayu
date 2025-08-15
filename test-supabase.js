const { uploadToSupabase } = require('./config/supabase');
require('dotenv').config();

async function testSupabaseUpload() {
  console.log('🧪 Testing Supabase Storage connection...\n');

  try {
    // Create a simple test image (1x1 pixel PNG as buffer)
    const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const testBuffer = Buffer.from(base64Data, 'base64');
    
    console.log('📤 Testing Supabase upload...');
    const supabaseUrl = await uploadToSupabase(testBuffer, 'test-image.png', 'test-uploads');
    
    console.log('✅ Supabase upload successful!');
    console.log('📸 Image URL:', supabaseUrl);
    console.log('\n🎯 Supabase Storage is working correctly!\n');
    
  } catch (error) {
    console.log('❌ Supabase upload failed:', error.message);
    console.log('\n🔧 Please check your Supabase configuration in .env file:');
    console.log('   - SUPABASE_URL');
    console.log('   - SUPABASE_ANON_KEY\n');
    console.log('🌐 Set up your free Supabase project at: https://supabase.com\n');
  }
}

testSupabaseUpload().catch(console.error);
