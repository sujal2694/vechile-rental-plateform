require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 MongoDB Connection Diagnostics\n');
console.log(`URI: ${MONGODB_URI ? MONGODB_URI.replace(/\/\/.*@/, '//***:***@') : 'NOT SET'}\n`);

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable not set');
  process.exit(1);
}

async function diagnose() {
  const client = new MongoClient(MONGODB_URI, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000
  });

  try {
    console.log('🔄 Attempting to connect...');
    await client.connect();
    console.log('✅ Connection successful!\n');

    const admin = client.db().admin();
    const status = await admin.ping();
    console.log('✅ Ping successful\n');

    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log(`✅ Collections in database: ${collections.length}`);
    collections.forEach(c => console.log(`   - ${c.name}`));

    if (collections.find(c => c.name === 'vehicles')) {
      const count = await db.collection('vehicles').countDocuments();
      console.log(`\n📊 Vehicles in DB: ${count}`);
      
      if (count > 0) {
        const sample = await db.collection('vehicles').findOne();
        console.log('\nSample vehicle:');
        console.log(JSON.stringify(sample, null, 2));
      }
    }

  } catch (error) {
    console.error('❌ Connection failed');
    console.error(`   Error: ${error.message}`);
    if (error.code === 'ENOTFOUND') {
      console.error('   Cause: DNS resolution failed - check internet connection');
    } else if (error.name === 'MongoServerError') {
      console.error('   Cause: MongoDB server error - check credentials');
    }
  } finally {
    await client.close();
    console.log('\n✅ Connection closed');
  }
}

diagnose();
