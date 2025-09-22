const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const path = require('path');
const dotenv = require('dotenv');

// Load .env explicitly
dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.log("MONGODB_URI from env:", process.env.MONGODB_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected for seeding'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Admin user data
const adminData = {
  name: 'SmartHire Admin',
  email: 'admin@smarthire.com',
  password: 'admin123', // will be hashed before saving
  role: 'admin',
};

// Function to seed admin user
const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    const admin = await User.create(adminData);

    console.log('✅ Admin user created successfully:', admin.email);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  }
};

// Run the seed function
seedAdmin();
