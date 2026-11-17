// backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const emailRoutes = require('./routes/email');
const aiRoutes = require('./routes/ai');
const clientRoutes = require('./routes/client');
const accountRoutes = require('./routes/account');
const dashboardRoutes = require('./routes/dashboard');
const assistantRoutes = require('./routes/assistant');

const { notFound, errorHandler } = require('./middlewares/errorHandler');

// Validate critical environment variables
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ FATAL: JWT_SECRET environment variable is missing.');
    process.exit(1);
  } else {
    console.warn('⚠️ WARNING: JWT_SECRET is not set in environment. Falling back to default development secret.');
    process.env.JWT_SECRET = 'supersecretkey123';
  }
}

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// API route registrations
app.use('/api/auth', authRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/assistant', assistantRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Ensure database connection completes successfully before the server starts listening
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();
