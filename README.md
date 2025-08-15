# 🌿 Ayurvedic Doctor Website

A complete full-stack responsive website for Ayurvedic practitioners to showcase their products and services with a powerful admin panel for content management.

![Ayurvedic Website](https://img.shields.io/badge/Status-Complete-success)
![Node.js](https://img.shields.io/badge/Node.js-v20.15.0-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-blue)
![Storage](https://img.shields.io/badge/Images-Supabase%20Storage-purple)

## ✨ Features

### 🌐 Public Website
- 🏠 **Beautiful Homepage** with doctor profile and hero section
- 📱 **Fully Responsive Design** - works perfectly on mobile, tablet, and desktop
- 🌿 **Ayurvedic-themed UI** with authentic earthy color palette
- 🛒 **Product Showcase** with detailed product information
- �️ **Image Gallery** with modal views for products
- �📞 **Clickable Contact Info** (phone, email, address)
- ⚡ **Fast Loading** with optimized images and efficient caching

### 🔐 Admin Panel
- � **Secure Authentication** with session management
- ➕ **Product Management** - Add, Edit, Delete products
- � **Image Upload System** with cloud storage (Supabase)
- 👨‍⚕️ **Doctor Profile Management** with photo upload
- 🏢 **Brand Settings** - Logo, tagline, and branding
- � **Password Management** - Change admin password
- 📊 **Real-time Updates** - Changes reflect immediately on website

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling
- **Multer** - File upload handling
- **Express-session** - Session management

### Frontend
- **HTML5** - Semantic markup
- **TailwindCSS** - Utility-first CSS framework
- **Vanilla JavaScript** - Client-side interactions
- **Responsive Design** - Mobile-first approach

### Storage & Hosting
- **Supabase Storage** - Cloud image storage (1GB free)
- **MongoDB Atlas** - Database hosting (512MB free tier)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Supabase account

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ayurvedic-doctor-website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   - Copy `.env.example` to `.env`
   - Update the following variables:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SESSION_SECRET=your_secure_session_secret
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_admin_password
   ```

4. **Set up Supabase Storage**:
   - Create a bucket named `images`
   - Set it as public
   - Configure storage policies for public access

5. **Run the application**:
   ```bash
   npm start
   ```

6. **Access the website**:
   - **Homepage**: http://localhost:3000
## 📁 Project Structure

```
ayurvedic-doctor-website/
├── public/                    # Static frontend files
│   ├── index.html            # Homepage
│   ├── admin-login.html      # Admin login page
│   └── admin-dashboard.html  # Admin dashboard
├── config/                   # Configuration files
│   └── supabase.js          # Supabase storage configuration
├── temp-uploads/            # Temporary file storage (auto-cleaned)
├── server.js               # Main Express.js server
├── package.json            # Project dependencies
├── .env                    # Environment variables
└── README.md              # This documentation
```

## 🔗 API Endpoints

### Public Routes
- `GET /` - Homepage
- `GET /api/products` - Fetch all products
- `GET /api/products/:id` - Get single product details
- `GET /api/doctor` - Get doctor profile information
- `GET /api/brand` - Get brand settings

### Protected Admin Routes
- `POST /admin/login` - Admin authentication
- `POST /admin/logout` - Admin logout
- `GET /admin/dashboard` - Admin dashboard
- `POST /api/products` - Add new product (with image upload)
- `PUT /api/products/:id` - Update existing product
- `DELETE /api/products/:id` - Delete product
- `PUT /api/doctor` - Update doctor profile (with photo upload)
- `PUT /api/brand` - Update brand settings (with logo upload)
- `PUT /api/admin/password` - Change admin password

## 📱 Usage Guide

### 👥 For Website Visitors
1. **Browse Products**: Visit homepage to see all available products
2. **Product Details**: Click any product card for detailed information
3. **Contact Doctor**: Use phone, email, or address for appointments
4. **Responsive Experience**: Works perfectly on any device

### 👨‍⚕️ For Admin/Doctor
1. **Login**: Access `/admin/login` with credentials
2. **Product Management**:
   - Add new products with high-quality images
   - Edit product information, pricing, and descriptions
   - Delete discontinued products
3. **Profile Management**:
   - Update personal information and bio
   - Upload professional photo
4. **Brand Management**:
   - Update clinic/brand name and tagline
   - Upload logo

## 🎨 Customization

### Color Scheme (Ayurvedic Theme)
```css
ayur-green: #4A7C59      /* Primary brand color */
ayur-light-green: #6FAF7C /* Hover states */
ayur-beige: #F5E6D3       /* Background color */
ayur-brown: #8B4513       /* Text color */
ayur-gold: #DAA520        /* Accent color */
```

### Database Schemas

#### 📦 Product Schema
```javascript
{
  name: String (required),        // Product name
  description: String (required), // Detailed description
  ingredients: String,            // Key ingredients
  benefits: String,              // Health benefits
  usage: String,                 // Usage instructions
  price: String,                 // Price information
  image: String,                 // Supabase image URL
  createdAt: Date               // Auto-generated timestamp
}
```

#### 👨‍⚕️ Doctor Schema
```javascript
{
  name: String (required),        // Doctor's full name
  contact: String (required),     // Phone number
  email: String (required),       // Email address
  address: String (required),     // Clinic address
  bio: String (required),        // Professional bio
  photo: String                  // Profile photo URL
}
```

#### 🏢 Brand Schema
```javascript
{
  logo: String,                  // Brand logo URL
  name: String,                  // Brand/clinic name
  tagline: String,              // Hero section tagline
  createdAt: Date               // Auto-generated timestamp
}
```

## 🔒 Security Features

- **Session-based Authentication** with secure session management
- **Password Protection** for admin panel access
- **File Upload Validation** - only image files allowed (JPEG, PNG, GIF, WebP)
- **File Size Limits** - maximum 5MB per image
- **Temporary File Cleanup** - auto-deletion of temp files
- **Environment Variables** for sensitive configuration
- **Cloud Storage Security** with Supabase RLS policies

## 🧪 Testing

Test your setup:

```bash
# Test Supabase Storage connection
node test-supabase.js

# Start development server
npm run dev

# Access admin panel
# http://localhost:3000/admin/login
```

## 🚀 Deployment Options

### Heroku
1. Create Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy: `git push heroku main`

### Vercel/Netlify
1. Connect your GitHub repository
2. Set environment variables in platform dashboard
3. Deploy automatically on git push

### VPS/Self-hosted
1. Use PM2 for process management: `pm2 start server.js`
2. Set up reverse proxy with Nginx
3. Configure SSL with Let's Encrypt

## 💰 Cost Breakdown (Free Tier)

| Service | Free Tier | Usage |
|---------|-----------|-------|
| **MongoDB Atlas** | 512MB storage | Database |
| **Supabase Storage** | 1GB + 2GB bandwidth/month | Images |
| **Hosting** | Various free options | Server |
| **Total Cost** | **$0/month** | Perfect for small clinics |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Common Issues

**MongoDB Connection Error**:
- Ensure IP is whitelisted in MongoDB Atlas
- Check connection string format

**Image Upload Failed**:
- Verify Supabase bucket is public
- Check storage policies are configured

**Admin Login Issues**:
- Clear browser cache and cookies
- Verify credentials in `.env` file

### Get Help
- Create an issue on GitHub
- Check the documentation
- Review error logs in browser console

---

## 🌟 Features Showcase

✅ **Complete Full-Stack Application**  
✅ **Cloud-Based Storage** (MongoDB Atlas + Supabase)  
✅ **Professional UI/UX Design**  
✅ **Mobile-Responsive Layout**  
✅ **Secure Admin Panel**  
✅ **Image Upload & Management**  
✅ **Real-time Content Updates**  
✅ **Production-Ready Code**  
✅ **Free Hosting Compatible**  
✅ **SEO-Friendly Structure**  

**Perfect for:** Ayurvedic practitioners, herbalists, wellness centers, alternative medicine clinics, and health product vendors.

---

*Built with ❤️ for the Ayurvedic community*

- Session-based authentication
- Protected admin routes
- File upload validation
- Environment variable configuration
- Input sanitization

## Production Deployment

1. Update `.env` with production values
2. Set up MongoDB Atlas or production MongoDB
3. Configure proper session secret
4. Set up reverse proxy (nginx)
5. Use PM2 for process management
6. Enable HTTPS

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file

2. **Image Upload Issues**:
   - Verify uploads/ directory exists
   - Check file permissions

3. **Admin Login Issues**:
   - Verify credentials in .env file
   - Clear browser session/cookies

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for your Ayurvedic practice.

---

**Happy Healing! 🌿**
