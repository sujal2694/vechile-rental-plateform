const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle_rental';

async function checkVehicles() {
  let client;
  try {
    console.log('📊 Checking all vehicles in database...\n');
    client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    
    await client.connect();
    const db = client.db();
    const vehiclesCollection = db.collection('vehicles');

    // Get all vehicles
    const vehicles = await vehiclesCollection.find({}).toArray();
    
    console.log(`Total vehicles: ${vehicles.length}\n`);
    
    if (vehicles.length === 0) {
      console.log('⚠️  No vehicles found in database!');
      console.log('💡 Tip: Seed the database by running: node seedData.js');
    } else {
      console.log('Vehicles with pricing:');
      vehicles.forEach((v, i) => {
        const priceInfo = v.pricePerDay ? `$${v.pricePerDay}/day` : 'INVALID';
        const status = v.pricePerDay && v.pricePerDay > 0 ? '✅' : '❌';
        console.log(`${i + 1}. ${status} ${v.name} - ${priceInfo} (approved: ${v.isApproved})`);
      });
    }

    // Check for problematic vehicle
    const problematicVehicle = await vehiclesCollection.findOne(
      { _id: { $eq: require('mongodb').ObjectId.isValid('69da1c1bb47c8630e6479b1c') ? new require('mongodb').ObjectId('69da1c1bb47c8630e6479b1c') : null } }
    );

    if (problematicVehicle) {
      console.log('\n🔍 Specific vehicle 69da1c1bb47c8630e6479b1c:');
      console.log(JSON.stringify(problematicVehicle, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (client) await client.close();
  }
}

checkVehicles();
