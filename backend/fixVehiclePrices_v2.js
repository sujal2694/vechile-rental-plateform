const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle_rental';

async function fixVehiclePrices() {
  let client;
  try {
    console.log('🔄 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db();
    const vehiclesCollection = db.collection('vehicles');

    // Check current state
    console.log('📊 Checking vehicles with invalid pricing...');
    const invalidVehicles = await vehiclesCollection.find({
      $or: [
        { pricePerDay: { $exists: false } },
        { pricePerDay: null },
        { pricePerDay: "" },
        { pricePerDay: { $type: "string" } }
      ]
    }).toArray();

    console.log(`Found ${invalidVehicles.length} vehicles with invalid pricing\n`);
    
    if (invalidVehicles.length > 0) {
      console.log('Invalid vehicles:');
      invalidVehicles.forEach(v => {
        console.log(`  - ${v._id}: name="${v.name}", pricePerDay="${v.pricePerDay}", price="${v.price}"`);
      });
      console.log();
    }

    // Fix the specific problematic vehicle first
    const problematicVehicleId = ObjectId.isValid('69da1c1bb47c8630e6479b1c') 
      ? new ObjectId('69da1c1bb47c8630e6479b1c')
      : null;

    if (problematicVehicleId) {
      console.log('🔧 Fixing the reported problematic vehicle...');
      const result1 = await vehiclesCollection.updateOne(
        { _id: problematicVehicleId },
        { 
          $set: { 
            pricePerDay: 50,
            isApproved: true 
          }
        }
      );
      if (result1.modifiedCount > 0) {
        console.log('✅ Fixed specific vehicle (69da1c1bb47c8630e6479b1c)\n');
      }
    }

    // Fix all other vehicles with invalid pricing
    if (invalidVehicles.length > 0) {
      console.log('🔧 Fixing all vehicles with invalid pricing...');
      const result2 = await vehiclesCollection.updateMany(
        {
          $or: [
            { pricePerDay: { $exists: false } },
            { pricePerDay: null },
            { pricePerDay: "" },
            { pricePerDay: { $type: "string" } }
          ]
        },
        { 
          $set: { 
            pricePerDay: 50,
            isApproved: true 
          },
          $unset: { price: "" }
        }
      );
      console.log(`✅ Fixed ${result2.modifiedCount} vehicles\n`);
    }

    // Verify the fixes
    console.log('✅ Verifying fixes...');
    const stillInvalid = await vehiclesCollection.countDocuments({
      $or: [
        { pricePerDay: { $exists: false } },
        { pricePerDay: null },
        { pricePerDay: "" },
        { pricePerDay: { $lte: 0 } }
      ]
    });

    if (stillInvalid === 0) {
      console.log('✅ All vehicles now have valid pricing!\n');
      
      // Show sample
      const sample = await vehiclesCollection.find({}).limit(5).toArray();
      console.log('Sample vehicles:');
      sample.forEach(v => {
        console.log(`  - ${v.name}: $${v.pricePerDay}/day (approved: ${v.isApproved})`);
      });
    } else {
      console.log(`⚠️  ${stillInvalid} vehicles still have invalid pricing`);
    }

    console.log('\n✅ Migration complete!');

  } catch (error) {
    console.error('❌ Error during migration:');
    console.error(`   Type: ${error.name}`);
    console.error(`   Message: ${error.message}`);
    if (error.code) console.error(`   Code: ${error.code}`);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n✅ Database connection closed');
    }
  }
}

fixVehiclePrices();
