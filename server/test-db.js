const mongoose = require('mongoose');

async function test() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/vendora', {
      serverSelectionTimeoutMS: 4000,
    });
    console.log('SUCCESS: Connected to MongoDB successfully!');
    process.exit(0);
  } catch (err) {
    console.error('FAILED: Could not connect to MongoDB:', err.message);
    process.exit(1);
  }
}

test();
