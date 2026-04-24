const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

console.log('SERVER URI:', process.env.MONGO_URI);

// =======================
// CONFIG FLAGS
// =======================
const isDev = process.env.NODE_ENV === 'development';
const isDemo = process.env.DEMO_MODE === 'true';

// =======================
// DB
// =======================
const connectDB = require('./config/db');

// =======================
// ROUTES
// =======================
const authRoutes = require('./routes/auth.routes');
const threatRoutes = require('./routes/threat.routes');
const adminRoutes = require('./routes/admin.routes'); // ✅ ADMIN

// =======================
// APP INIT
// =======================
const app = express();

// =======================
// CONNECT DATABASE
// =======================
connectDB();

// =======================
// MIDDLEWARE
// =======================
app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

if (isDev) {
  app.use(morgan('dev'));
}

// =======================
// RATE LIMITING
// =======================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDemo ? 1000 : 100,
  message: { error: 'Too many requests, try again later.' },
});

app.use('/api', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDemo ? 1000 : 5,
  message: { error: 'Too many login attempts, try again later.' },
});

// =======================
// HEALTH CHECK
// =======================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    time: new Date().toISOString(),
    mode: isDemo ? 'DEMO' : 'PRODUCTION'
  });
});

// =======================
// DEBUG ROUTE (IMPORTANT)
// =======================
// 👉 USE THIS TO VERIFY SERVER IS LOADING ROUTES
app.get('/api/admin/test', (req, res) => {
  res.json({ message: 'Admin route working ✅' });
});

// =======================
// ROUTES
// =======================
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/threats', threatRoutes);
app.use('/api/admin', adminRoutes); // ✅ CRITICAL LINE

// =======================
// 404 HANDLER
// =======================
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.originalUrl} not found`,
  });
});

// =======================
// ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong',
  });
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n=================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}/api/health`);
  console.log(`🧪 Mode: ${isDemo ? 'DEMO' : 'PRODUCTION'}`);
  console.log('=================================\n');
});

module.exports = app;