require('dotenv').config();

const app = require('./src/app');
const { connectDB, disconnectDB } = require('./src/config/db');
const Course = require('./src/models/course.model');
const { seedDB } = require('./seed/seed');
const { ensureAdminUser } = require('./src/config/adminBootstrap');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Start HTTP Server immediately so nodemon never crashes
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
      console.log(`🌐 Mode: ${process.env.NODE_ENV || 'development'}`);
    });

    // 2. Connect to Database with post-connection initializations
    const onDBConnected = async () => {
      // Ensure unique Admin user exists
      try {
        await ensureAdminUser();
      } catch (adminErr) {
        console.warn('⚠️  Admin bootstrap warning:', adminErr.message);
      }

      // Check if DB is empty; if so, auto-seed
      try {
        const courseCount = await Course.countDocuments();
        if (courseCount === 0) {
          console.log('📦 Database has 0 courses. Initializing auto-seed...');
          await seedDB(true);
          console.log('✅ Auto-seed completed successfully.');
        } else {
          console.log(`ℹ️  Database initialized (${courseCount} courses available).`);
        }
      } catch (seedErr) {
        console.warn('⚠️  Auto-seed check warning:', seedErr.message);
      }
    };

    // Trigger connection with automatic background retry
    connectDB(onDBConnected);

    // 4. Graceful Shutdown Handlers
    const handleShutdown = async (signal) => {
      console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        console.log('🔒 HTTP server closed.');
        await disconnectDB();
        console.log('🔌 Database connection closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please terminate the process or set PORT in .env.`);
      } else {
        console.error('❌ Server error:', err);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
