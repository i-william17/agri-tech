const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Sequelize instance and models
const { sequelize } = require('./models'); // Make sure models/index.js exports sequelize
const seedAdmin = require('./scripts/seedAdmin');

// Import routes
const authRoutes = require('./routes/auth');
const farmerRoutes = require('./routes/farmers');
const cropRoutes = require('./routes/crops');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/crops', cropRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: 'OK',
      database: 'Connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      database: 'Disconnected',
      error: error.message,
    });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Shamba API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Server port
const PORT = process.env.PORT || 5000;

// Start server function
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Neon PostgreSQL connection established successfully.');

    // Sync all models
    await sequelize.sync({ alter: true }); // use { force: true } for dev reset
    console.log('Database synchronized successfully.');

    // // Seed admin user if needed
    // await seedAdmin();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // exit if DB connection fails
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

// Start the app
startServer();
