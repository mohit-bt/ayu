const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadToSupabase, deleteFromSupabase } = require('./config/supabase');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Cleanup function for temporary files
const cleanupTempFiles = () => {
  try {
    if (fs.existsSync(tempUploadsDir)) {
      const files = fs.readdirSync(tempUploadsDir);
      const now = Date.now();
      const maxAge = 60 * 60 * 1000; // 1 hour in milliseconds
      
      files.forEach(file => {
        const filePath = path.join(tempUploadsDir, file);
        const stats = fs.statSync(filePath);
        const age = now - stats.mtime.getTime();
        
        if (age > maxAge) {
          fs.unlinkSync(filePath);
          console.log('Cleaned up old temp file:', file);
        }
      });
    }
  } catch (error) {
    console.error('Error during temp file cleanup:', error.message);
  }
};

// Run cleanup every hour
setInterval(cleanupTempFiles, 60 * 60 * 1000);

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: String,
  benefits: String,
  usage: String,
  price: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Doctor Profile Schema
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  bio: { type: String, required: true },
  photo: String // Doctor's photo
});

// Brand Settings Schema
const brandSchema = new mongoose.Schema({
  logo: String, // Brand logo
  name: { type: String, default: "Dr. Ayurveda" }, // Brand name
  tagline: String, // Brand tagline for hero section
  createdAt: { type: Date, default: Date.now }
});

const Doctor = mongoose.model('Doctor', doctorSchema);
const Brand = mongoose.model('Brand', brandSchema);

// Admin Schema for storing login credentials
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// Note: No local uploads serving - everything is cloud-based

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Multer configuration for temporary storage (before cloud upload)
const tempUploadsDir = path.join(__dirname, 'temp-uploads');

// Ensure temp uploads directory exists
if (!fs.existsSync(tempUploadsDir)) {
  fs.mkdirSync(tempUploadsDir, { recursive: true });
}

// Temporary storage for processing
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempUploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: tempStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('File upload attempted:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype
    });
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
    
    cb(null, true);
  }
});

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/admin/login');
  }
};

// Helper function for Supabase image upload
const uploadToCloud = async (filePath, originalName) => {
  try {
    console.log('� Uploading to Supabase Storage...');
    
    // Read file as buffer
    const fileBuffer = fs.readFileSync(filePath);
    
    // Upload to Supabase
    const supabaseUrl = await uploadToSupabase(fileBuffer, originalName, 'products');
    
    // Clean up temporary file
    fs.unlinkSync(filePath);
    
    return supabaseUrl;
    
  } catch (error) {
    console.error('❌ Supabase upload failed:', error.message);
    
    // Clean up temporary file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

// Helper functions for different upload fields
const handleImageUpload = (fieldName) => async (req, res, next) => {
  upload.single(fieldName)(req, res, async (error) => {
    if (error) {
      console.error(`Upload error for ${fieldName}:`, error.message);
      return res.status(400).json({ error: error.message });
    }
    
    if (!req.file) {
      return next(); // No file uploaded, continue
    }
    
    try {
      // Upload to cloud and get URL
      const cloudUrl = await uploadToCloud(req.file.path, req.file.originalname);
      
      // Replace file info with cloud URL
      req.file.path = cloudUrl;
      req.file.cloudUrl = cloudUrl;
      
      console.log(`✅ ${fieldName} uploaded successfully:`, cloudUrl);
      next();
      
    } catch (uploadError) {
      console.error(`Cloud upload failed for ${fieldName}:`, uploadError.message);
      res.status(500).json({ error: uploadError.message });
    }
  });
};

const handleFileUpload = handleImageUpload('image');
const handlePhotoUpload = handleImageUpload('photo');
const handleLogoUpload = handleImageUpload('logo');

// Routes

// Home page - serve public homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin login page
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

// Admin route - redirect to login
app.get('/admin', (req, res) => {
  res.redirect('/admin/login');
});

// Admin login POST
app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // First try to find admin in database
    const admin = await Admin.findOne({ username });
    
    if (admin && admin.password === password) {
      req.session.isAuthenticated = true;
      req.session.adminUsername = username;
      res.redirect('/admin/dashboard');
    } else {
      // Fallback to environment variables for initial login
      if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        req.session.isAuthenticated = true;
        req.session.adminUsername = username;
        
        // Create admin record in database if it doesn't exist
        const existingAdmin = await Admin.findOne({ username });
        if (!existingAdmin) {
          await Admin.create({ username, password });
        }
        
        res.redirect('/admin/dashboard');
      } else {
        res.redirect('/admin/login?error=1');
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    res.redirect('/admin/login?error=1');
  }
});

// Admin dashboard
app.get('/admin/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

// Admin logout
app.post('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// API Routes

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new product (protected)
app.post('/api/products', requireAuth, handleFileUpload, async (req, res) => {
  try {
    console.log('Product creation attempt:', {
      hasFile: !!req.file,
      fileInfo: req.file ? {
        originalname: req.file.originalname,
        path: req.file.path,
        size: req.file.size
      } : 'No file'
    });

    const { name, description, ingredients, benefits, usage, price } = req.body;
    const image = req.file ? req.file.path : ''; // Cloudinary URL is in req.file.path

    if (req.file) {
      console.log('File uploaded to Cloudinary:', req.file.path);
    }

    const product = new Product({
      name,
      description,
      ingredients,
      benefits,
      usage,
      price,
      image
    });

    await product.save();
    console.log('Product created successfully:', product.name);
    res.json(product);
  } catch (error) {
    console.error('Product creation error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ error: error.message || 'Failed to create product' });
  }
});

// Update product (protected)
app.put('/api/products/:id', requireAuth, handleFileUpload, async (req, res) => {
  try {
    console.log('Product update attempt:', {
      productId: req.params.id,
      hasFile: !!req.file,
      fileInfo: req.file ? {
        originalname: req.file.originalname,
        path: req.file.path,
        size: req.file.size
      } : 'No file'
    });

    const { name, description, ingredients, benefits, usage, price } = req.body;
    const updateData = { name, description, ingredients, benefits, usage, price };

    if (req.file) {
      console.log('File uploaded to Cloudinary:', req.file.path);
      updateData.image = req.file.path; // Cloudinary URL is in req.file.path
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    console.log('Product updated successfully:', product.name);
    res.json(product);
  } catch (error) {
    console.error('Product update error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      productId: req.params.id
    });
    res.status(500).json({ error: error.message || 'Failed to update product' });
  }
});

// Delete product (protected)
app.delete('/api/products/:id', requireAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Doctor profile API
app.get('/api/doctor', async (req, res) => {
  try {
    let doctor = await Doctor.findOne();
    if (!doctor) {
      // Create default doctor profile if none exists
      doctor = new Doctor({
        name: "Dr. Priya Sharma",
        contact: "+91-9876543210",
        email: "dr.priya@ayurveda.com",
        address: "123 Wellness Center, Ayurvedic Street, New Delhi - 110001",
        bio: "Certified Ayurvedic Practitioner with 15+ years of experience in traditional healing. Specialized in herbal remedies, panchakarma, and holistic wellness treatments."
      });
      await doctor.save();
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Brand settings API
app.get('/api/brand', async (req, res) => {
  try {
    let brand = await Brand.findOne();
    if (!brand) {
      // Create default brand settings
      brand = new Brand({
        name: "Dr. Ayurveda",
        tagline: "Natural Healing Through Ayurveda"
      });
      await brand.save();
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update doctor profile (protected)
app.put('/api/doctor', requireAuth, handlePhotoUpload, async (req, res) => {
  try {
    const { name, contact, email, address, bio } = req.body;
    let doctor = await Doctor.findOne();
    
    const updateData = { name, contact, email, address, bio };
    
    if (req.file) {
      updateData.photo = req.file.path; // Cloudinary URL is in req.file.path
    }
    
    if (!doctor) {
      doctor = new Doctor(updateData);
    } else {
      Object.assign(doctor, updateData);
    }
    
    await doctor.save();
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update brand settings (protected)
app.put('/api/brand', requireAuth, handleLogoUpload, async (req, res) => {
  try {
    const { name, tagline } = req.body;
    let brand = await Brand.findOne();
    
    const updateData = { name, tagline };
    
    if (req.file) {
      updateData.logo = req.file.path; // Cloudinary URL is in req.file.path
    }
    
    if (!brand) {
      brand = new Brand(updateData);
    } else {
      Object.assign(brand, updateData);
    }
    
    await brand.save();
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change admin password (protected)
app.put('/api/admin/password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const username = req.session.adminUsername || process.env.ADMIN_USERNAME;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new passwords are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }
    
    // Find admin record
    let admin = await Admin.findOne({ username });
    
    // Verify current password
    const actualCurrentPassword = admin ? admin.password : process.env.ADMIN_PASSWORD;
    if (currentPassword !== actualCurrentPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // Update or create admin record
    if (admin) {
      admin.password = newPassword;
      await admin.save();
    } else {
      await Admin.create({ username, password: newPassword });
    }
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Global error handlers
app.use((error, req, res, next) => {
  console.error('Global error handler caught:', {
    message: error.message,
    stack: error.stack,
    name: error.name
  });
  
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ 
      error: `Upload error: ${error.message}` 
    });
  }
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({ 
      error: `Validation error: ${error.message}` 
    });
  }
  
  res.status(500).json({ 
    error: 'Internal server error occurred' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Admin credentials: doctor / ayurveda123');
});
