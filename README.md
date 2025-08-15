# Ayurvedic Doctor Website

A full-stack responsive website for an Ayurvedic doctor to showcase products with an admin panel for product management.

## Features

### Public Website
- 🏠 **Homepage** with doctor profile and product showcase
- 📱 **Responsive design** for mobile, tablet, and desktop
- 🌿 **Ayurvedic-themed design** with earthy color palette
- 🛒 **Product catalog** with detailed product information
- 📞 **Clickable contact information** for easy communication
- 🔍 **Product modal** with detailed views

### Admin Panel
- 🔐 **Secure login** for doctor/admin access
- ➕ **Add new products** with image upload
- ✏️ **Edit existing products** 
- 🗑️ **Delete products**
- 👨‍⚕️ **Manage doctor profile** information
- 📸 **Image upload** for product photos

## Tech Stack

- **Frontend**: HTML, CSS (TailwindCSS), Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **File Upload**: Multer
- **Session Management**: Express-session

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd /home/mohit/Desktop/website1
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - The `.env` file is already configured with default values
   - For production, update the following in `.env`:
     ```
     MONGODB_URI=mongodb://localhost:27017/ayurvedic_doctor
     SESSION_SECRET=your_secure_secret_key_here
     PORT=3000
     ADMIN_USERNAME=doctor
     ADMIN_PASSWORD=your_secure_password
     ```

4. **Start MongoDB**:
   - Make sure MongoDB is running on your system
   - For local MongoDB: `mongod`
   - For MongoDB Atlas: Update MONGODB_URI with your connection string

5. **Seed the database** (optional - adds sample data):
   ```bash
   npm run seed
   ```

6. **Start the server**:
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

7. **Access the website**:
   - **Public Website**: http://localhost:3000
   - **Admin Login**: http://localhost:3000/admin/login
   - **Admin Credentials**: 
     - Username: `doctor`
     - Password: `ayurveda123`

## Project Structure

```
ayurvedic-doctor-website/
├── public/                 # Static files
│   ├── index.html         # Homepage
│   ├── admin-login.html   # Admin login page
│   └── admin-dashboard.html # Admin dashboard
├── uploads/               # Product images storage
├── server.js             # Main server file
├── seed.js              # Database seeding script
├── package.json         # Dependencies
├── .env                 # Environment variables
└── README.md           # This file
```

## API Endpoints

### Public Endpoints
- `GET /` - Homepage
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/doctor` - Get doctor profile

### Protected Endpoints (Admin only)
- `POST /admin/login` - Admin login
- `GET /admin/dashboard` - Admin dashboard
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PUT /api/doctor` - Update doctor profile

## Usage Guide

### For Visitors
1. Visit the homepage to browse products
2. Click on product cards to view detailed information
3. Use the contact information to reach the doctor

### For Admin/Doctor
1. Login at `/admin/login`
2. Use the dashboard to:
   - Add new products with images
   - Edit existing product information
   - Delete products no longer available
   - Update doctor profile information

## Customization

### Styling
- The website uses TailwindCSS with custom Ayurvedic color scheme
- Colors are defined in the Tailwind config:
  - `ayur-green`: #4A7C59
  - `ayur-light-green`: #6FAF7C
  - `ayur-beige`: #F5E6D3
  - `ayur-brown`: #8B4513
  - `ayur-gold`: #DAA520

### Database Schema

#### Product Schema
```javascript
{
  name: String (required),
  description: String (required),
  ingredients: String,
  benefits: String,
  usage: String,
  price: String,
  image: String,
  createdAt: Date
}
```

#### Doctor Schema
```javascript
{
  name: String (required),
  contact: String (required),
  address: String (required),
  bio: String (required)
}
```

## Security Features

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
