const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB, closeDB } = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  process.env.ADMIN_URL || 'http://localhost:3001',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy violation: Origin not allowed'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Connect to Database
const startServer = async () => {
  try {
    await connectDB();
    console.log('✓ Database connected');

    // Routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/vehicles', require('./routes/vehicleRoutes'));
    app.use('/api/bookings', require('./routes/bookingRoutes'));
    app.use('/api/users', require('./routes/userRoutes'));
    app.use('/api/contact', require('./routes/contactRoutes'));

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
      });
    });

    // Global error handling middleware
    app.use((err, req, res, next) => {
      console.error('✗ Error:', err.message);

      // Multer errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size exceeds limit (5MB max)',
        });
      }

      if (err.message === 'Only image files (JPEG, JPG, PNG, GIF) are allowed!') {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      // JWT errors
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
        });
      }

      // Generic error
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
      });
    });

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(async () => {
        await closeDB();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received, shutting down gracefully...');
      server.close(async () => {
        await closeDB();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
