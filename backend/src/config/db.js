// backend/src/config/db.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const seedData = require('../seed');

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  // Standardize on MONGODB_URI (with MONGO_URI fallback for backwards compatibility)
  let mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    if (isProduction) {
      console.error('❌ FATAL: MONGODB_URI is not defined in production environment.');
      console.error('Production deployments must connect to a remote database (e.g., MongoDB Atlas).');
      process.exit(1);
    }

    // In development only: spin up MongoMemoryServer if no URI is provided
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('🧪 Using in‑memory MongoDB for local development');
    } catch (memErr) {
      console.error('Failed to initialize local in-memory MongoDB:', memErr);
      process.exit(1);
    }
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Seed demo data only if explicitly requested, or by default in non-production local development
    const shouldSeed = process.env.SEED_DEMO_DATA !== undefined
      ? (process.env.SEED_DEMO_DATA === 'true' || process.env.SEED_DEMO_DATA === '1')
      : !isProduction;

    if (shouldSeed) {
      await ensureDemoUsers();
    } else {
      console.log('ℹ️ Demo data seeding skipped (SEED_DEMO_DATA is false/disabled in production).');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

async function ensureDemoUsers() {
  try {
    const passwordHash = await bcrypt.hash('Pass123!', 10);

    // 1. Executive Assistant: assistant@example.com
    // Only create if user does NOT exist. Do NOT overwrite existing user password.
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
      console.log('Created demo user: assistant@example.com');
    }

    // 2. Executive / Client: client@example.com
    // Only create if user does NOT exist. Do NOT overwrite existing user password.
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
      console.log('Created demo user: client@example.com');
    }

    // Link counterpart relationships if not already linked
    let updated = false;
    if (!assistant.clientId || !assistant.clientId.equals(client._id)) {
      assistant.clientId = client._id;
      updated = true;
    }
    if (!client.assistantId || !client.assistantId.equals(assistant._id)) {
      client.assistantId = assistant._id;
      updated = true;
    }
    if (updated) {
      await assistant.save();
      await client.save();
    }

    // Seed emails, drafts, meetings & notifications for the demo pair
    await seedData(assistant, client);
  } catch (err) {
    console.error('Demo user creation/linking error:', err);
  }
}

module.exports = connectDB;
