const { MongoClient, ServerApiVersion } = require('mongodb');

let db = null;
let client = null;

/**
 * Connect to MongoDB with proper error handling and optimization
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle_rental';

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    client = new MongoClient(mongoURI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
    });

    await client.connect();
    db = client.db('vehicle_rental');

    // Verify connection
    await db.admin().ping();
    console.log('✓ Connected to MongoDB successfully');

    // Create collections and indexes
    await createCollectionsAndIndexes();

    return db;
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

/**
 * Create collections and indexes for better performance
 */
const createCollectionsAndIndexes = async () => {
  try {
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    // Create collections if they don't exist
    if (!collectionNames.includes('users')) {
      await db.createCollection('users');
      console.log('✓ Created users collection');
    }

    if (!collectionNames.includes('vehicles')) {
      await db.createCollection('vehicles');
      console.log('✓ Created vehicles collection');
    }

    if (!collectionNames.includes('bookings')) {
      await db.createCollection('bookings');
      console.log('✓ Created bookings collection');
    }

    if (!collectionNames.includes('contacts')) {
      await db.createCollection('contacts');
      console.log('✓ Created contacts collection');
    }

    // Create indexes for performance
    await createIndexes();
  } catch (error) {
    console.error('✗ Error creating collections:', error.message);
  }
};

/**
 * Create database indexes for query optimization
 */
const createIndexes = async () => {
  try {
    // Users indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ createdAt: 1 });

    // Vehicles indexes
    await db.collection('vehicles').createIndex({ category: 1 });
    await db.collection('vehicles').createIndex({ name: 'text' });
    await db.collection('vehicles').createIndex({ pricePerDay: 1 });
    await db.collection('vehicles').createIndex({ isApproved: 1 });
    await db.collection('vehicles').createIndex({ createdAt: 1 });

    // Bookings indexes
    await db.collection('bookings').createIndex({ userId: 1 });
    await db.collection('bookings').createIndex({ vehicleId: 1 });
    await db.collection('bookings').createIndex({ status: 1 });
    await db.collection('bookings').createIndex({ startDate: 1, endDate: 1 });
    await db.collection('bookings').createIndex({ paymentStatus: 1 });
    await db.collection('bookings').createIndex({ createdAt: -1 });

    // Contacts indexes
    await db.collection('contacts').createIndex({ email: 1 });
    await db.collection('contacts').createIndex({ status: 1 });
    await db.collection('contacts').createIndex({ createdAt: -1 });

    console.log('✓ Database indexes created');
  } catch (error) {
    console.warn('⚠ Index creation warning:', error.message);
  }
};

/**
 * Get database instance
 */
const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return db;
};

/**
 * Get MongoDB client
 */
const getClient = () => {
  if (!client) {
    throw new Error('MongoDB client not initialized');
  }
  return client;
};

/**
 * Gracefully close database connection
 */
const closeDB = async () => {
  try {
    if (client) {
      await client.close();
      console.log('✓ MongoDB connection closed');
    }
  } catch (error) {
    console.error('✗ Error closing MongoDB connection:', error.message);
  }
};

module.exports = { connectDB, getDB, getClient, closeDB };
