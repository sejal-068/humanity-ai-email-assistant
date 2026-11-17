// backend/src/config/db.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const seedData = require('../seed');

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;
    // If no external URI provided, spin up an in‑memory MongoDB instance (useful for demo & CI)
    if (!mongoUri) {
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('🧪 Using in‑memory MongoDB for development');
    }
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Automatically seed linked demo users
    await ensureDemoUsers();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

async function ensureDemoUsers() {
  try {
    const passwordHash = await bcrypt.hash('Pass123!', 10);

    // 1. Executive Assistant: assistant@example.com (Pass123!)
    let assistant = await User.findOne({ email: 'assistant@example.com' });
    if (!assistant) {
      assistant = new User({
        name: 'Alex Rivera (Executive Assistant)',
        email: 'assistant@example.com',
        passwordHash,
        role: 'assistant',
        onboarded: true
      });
      await assistant.save();
    } else {
      assistant.passwordHash = passwordHash;
      await assistant.save();
    }

    // 2. Executive / Client: client@example.com (Pass123!)
    let client = await User.findOne({ email: 'client@example.com' });
    if (!client) {
      client = new User({
        name: 'Dr. Evelyn Sterling (Founder & CEO)',
        email: 'client@example.com',
        passwordHash,
        role: 'client',
        onboarded: true,
        assistantId: assistant._id
      });
      await client.save();
    } else {
      client.passwordHash = passwordHash;
      await client.save();
    }

    assistant.clientId = client._id;
    client.assistantId = assistant._id;
    await assistant.save();
    await client.save();

    // Also support fallback existing accounts if any
    let sejalUser = await User.findOne({ email: 'sejalshambharkar068@gmail.com' });
    if (!sejalUser) {
      sejalUser = new User({
        name: 'Sejal Shambharkar',
        email: 'sejalshambharkar068@gmail.com',
        passwordHash,
        role: 'assistant',
        onboarded: true,
        clientId: client._id
      });
      await sejalUser.save();
    }

    // Now seed emails, drafts, meetings & notifications
    await seedData(assistant, client);
  } catch (err) {
    console.error('Demo user creation error:', err);
  }
}

module.exports = connectDB;
