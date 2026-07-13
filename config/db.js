const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI stored in the .env file.
 * Open MongoDB Compass with the same URI (MONGO_URI) to inspect data visually.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not defined. Please set it in your .env file.');
  }

  try {
    await mongoose.connect(uri);
    console.log(`[db] MongoDB connected -> ${mongoose.connection.name}`);
  } catch (err) {
    console.error('[db] MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
