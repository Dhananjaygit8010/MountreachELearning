const dns = require('dns');

// Prevent Windows Node.js DNS resolution failures for Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch (e) {
  // Ignore DNS config warnings in restrictive environments
}

const mongoose = require('mongoose');

let isConnected = false;
let retryTimeout = null;

const connectDB = async (onConnectCallback = null) => {
  const connUri = (process.env.MONGODB_URI || process.env.MONGO_URI || '').trim();

  if (!connUri) {
    console.error('❌ MONGODB_URI is missing in .env configuration file.');
    return;
  }

  const sanitizedHost = connUri.split('@')[1] ? connUri.split('@')[1].split('/')[0] : 'Atlas Cluster';

  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    console.log(`📡 Connecting to MongoDB Atlas Cloud Cluster (${sanitizedHost})...`);

    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
      family: 4, // Force IPv4
    });

    isConnected = true;
    if (retryTimeout) {
      clearTimeout(retryTimeout);
      retryTimeout = null;
    }

    console.log(`✅ MongoDB Connected to Atlas Cloud: ${conn.connection.host} (DB: ${conn.connection.name})`);

    if (onConnectCallback && typeof onConnectCallback === 'function') {
      try {
        await onConnectCallback();
      } catch (cbErr) {
        console.warn('⚠️  Post-connection hook warning:', cbErr.message);
      }
    }

    return conn;
  } catch (error) {
    isConnected = false;
    console.error(`❌ MongoDB Atlas Connection Issue: ${error.message}`);

    if (
      error.message.includes('alert internal error') ||
      error.message.includes('SSL alert number 80') ||
      error.name === 'MongooseServerSelectionError'
    ) {
      console.log('\n⚠️  [MONGODB ATLAS IP ACCESS NOTICE]');
      console.log('👉 MongoDB Atlas sends "SSL alert number 80" when your public IP is not in Atlas Network Access.');
      console.log('👉 Quick Fix (30 seconds):');
      console.log('   1. Go to https://cloud.mongodb.com/ -> Network Access');
      console.log('   2. Click "Add IP Address" -> "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0) -> Confirm.');
      console.log('👉 Nodemon will NOT crash. Server is actively retrying connection in the background...\n');
    }

    // Automatically retry connecting in the background without crashing the server process
    if (!retryTimeout) {
      retryTimeout = setTimeout(() => {
        retryTimeout = null;
        connectDB(onConnectCallback);
      }, 6000);
    }
  }
};

const disconnectDB = async () => {
  if (retryTimeout) clearTimeout(retryTimeout);
  await mongoose.disconnect();
};

module.exports = { connectDB, disconnectDB, isConnected: () => isConnected };
