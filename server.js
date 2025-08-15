const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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
app.use('/uploads', express.static('uploads'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/admin/login');
  }
};

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
app.post('/api/products', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, ingredients, benefits, usage, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

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
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product (protected)
app.put('/api/products/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, ingredients, benefits, usage, price } = req.body;
    const updateData = { name, description, ingredients, benefits, usage, price };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
app.put('/api/doctor', requireAuth, upload.single('photo'), async (req, res) => {
  try {
    const { name, contact, email, address, bio } = req.body;
    let doctor = await Doctor.findOne();
    
    const updateData = { name, contact, email, address, bio };
    
    if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
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
app.put('/api/brand', requireAuth, upload.single('logo'), async (req, res) => {
  try {
    const { name, tagline } = req.body;
    let brand = await Brand.findOne();
    
    const updateData = { name, tagline };
    
    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Admin credentials: doctor / ayurveda123');
});
