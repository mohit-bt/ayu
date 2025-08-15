const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to upload file to Supabase Storage
async function uploadToSupabase(fileBuffer, fileName, folder = 'products') {
  try {
    console.log('� Uploading to Supabase Storage:', fileName);
    
    // Create unique filename with timestamp
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;
    const storagePath = `${folder}/${uniqueFileName}`;
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('images') // bucket name
      .upload(storagePath, fileBuffer, {
        contentType: 'auto',
        cacheControl: '3600'
      });
    
    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(storagePath);
    
    console.log('✅ Supabase upload successful:', publicUrl);
    return publicUrl;
    
  } catch (error) {
    console.error('❌ Supabase upload failed:', error.message);
    throw new Error(`Supabase upload failed: ${error.message}`);
  }
}

// Helper function to delete file from Supabase Storage
async function deleteFromSupabase(fileUrl) {
  try {
    // Extract file path from URL
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(-2).join('/'); // Get folder/filename
    
    const { error } = await supabase.storage
      .from('images')
      .remove([filePath]);
    
    if (error) {
      throw new Error(`Delete error: ${error.message}`);
    }
    
    console.log('🗑️ File deleted from Supabase:', filePath);
    
  } catch (error) {
    console.error('❌ Supabase deletion failed:', error.message);
    throw error;
  }
}

module.exports = {
  supabase,
  uploadToSupabase,
  deleteFromSupabase
};
