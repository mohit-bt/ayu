const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
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

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  bio: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);

// Sample data
const sampleProducts = [
  {
    name: "Ashwagandha Capsules",
    description: "Premium quality Ashwagandha root extract capsules for stress relief and energy enhancement. Made from organically grown Ashwagandha roots.",
    ingredients: "Pure Ashwagandha root extract (Withania somnifera), Vegetable capsule",
    benefits: "Reduces stress and anxiety, Boosts energy levels, Improves sleep quality, Enhances immunity, Supports muscle strength",
    usage: "Take 1-2 capsules daily with warm water after meals, or as directed by your Ayurvedic practitioner.",
    price: "499"
  },
  {
    name: "Triphala Powder",
    description: "Traditional Ayurvedic digestive support powder made from three sacred fruits: Amalaki, Bibhitaki, and Haritaki.",
    ingredients: "Equal parts of Amalaki (Emblica officinalis), Bibhitaki (Terminalia bellirica), Haritaki (Terminalia chebula)",
    benefits: "Supports healthy digestion, Natural detoxification, Improves elimination, Rich in antioxidants, Promotes healthy weight",
    usage: "Mix 1 teaspoon with warm water before bedtime. Start with half teaspoon and gradually increase.",
    price: "299"
  },
  {
    name: "Brahmi Hair Oil",
    description: "Nourishing hair oil infused with Brahmi and other Ayurvedic herbs to promote healthy hair growth and scalp health.",
    ingredients: "Brahmi (Bacopa monnieri), Bhringraj, Amla, Coconut oil, Sesame oil, Curry leaves",
    benefits: "Promotes hair growth, Prevents premature graying, Reduces hair fall, Nourishes scalp, Improves hair texture",
    usage: "Massage gently into scalp and hair. Leave for at least 1 hour or overnight. Wash with mild shampoo.",
    price: "399"
  },
  {
    name: "Turmeric Golden Milk Mix",
    description: "Aromatic blend of turmeric and traditional spices for preparing the healing golden milk. Perfect for daily wellness routine.",
    ingredients: "Organic turmeric, Black pepper, Ginger, Cardamom, Cinnamon, Nutmeg, Ashwagandha",
    benefits: "Anti-inflammatory properties, Boosts immunity, Improves sleep, Supports joint health, Aids digestion",
    usage: "Mix 1 teaspoon with warm milk. Add honey if desired. Consume before bedtime for best results.",
    price: "249"
  }
];

const doctorProfile = {
  name: "Dr. Priya Sharma",
  contact: "+91-9876543210",
  email: "dr.priya@ayurveda.com",
  address: "Wellness Ayurveda Center, 123 Herbal Street, Green Park, New Delhi - 110016",
  bio: "Dr. Priya Sharma is a certified Ayurvedic practitioner with over 15 years of experience in traditional healing. She holds a BAMS degree and specializes in Panchakarma treatments, herbal medicine, and holistic wellness. Her approach combines ancient Ayurvedic wisdom with modern understanding to provide personalized treatment plans for each patient."
};

async function seedDatabase() {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await Doctor.deleteMany({});
    
    console.log('Cleared existing data...');
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('✅ Sample products inserted successfully');
    
    // Insert doctor profile
    await Doctor.create(doctorProfile);
    console.log('✅ Doctor profile created successfully');
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('You can now:');
    console.log('1. Visit http://localhost:3000 to see the website');
    console.log('2. Login to admin panel with: doctor / ayurveda123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
