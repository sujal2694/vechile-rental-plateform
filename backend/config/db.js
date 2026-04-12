const { MongoClient, ServerApiVersion } = require('mongodb');

let db;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle_rental';
    
    const client = new MongoClient(mongoURI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();
    db = client.db('vehicle_rental');
    
    console.log('Connected to MongoDB');
    
    // Create collections if they don't exist
    await createCollections();
    
    return db;
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const createCollections = async () => {
  try {
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes('users')) {
      await db.createCollection('users');
    }
    if (!collectionNames.includes('vehicles')) {
      await db.createCollection('vehicles');
    }
    if (!collectionNames.includes('bookings')) {
      await db.createCollection('bookings');
    }
    if (!collectionNames.includes('contacts')) {
      await db.createCollection('contacts');
    }
  } catch (error) {
    console.error('Error creating collections:', error);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

module.exports = { connectDB, getDB };
