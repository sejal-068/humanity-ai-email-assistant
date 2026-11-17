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

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/assistant', assistantRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

