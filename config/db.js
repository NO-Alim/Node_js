const mongoose = require('mongoose');
require('dotenv').config();

// before run this function create a .env file and add the MONGO_URI
// Example: MONGO_URI = 'mongodb+srv://your_username:your_password@your_cluster_url/your_database_name?retryWrites=true&w=majority'

async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = { dbConnect };
