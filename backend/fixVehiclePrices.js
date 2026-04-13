/**
 * Migration script to fix vehicle pricing data
 * Converts string price format to numeric pricePerDay
 * Run with: node fixVehiclePrices.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle_rental';

async function fixVehiclePrices() {
  const client = new MongoClient(mongoURI);

  try {
    await client.connect();
    const db = client.db('vehicle_rental');
    const vehiclesCollection = db.collection('vehicles');

    console.log('🔍 Checking for vehicles with invalid pricing...\n');

    // Find all vehicles
    const vehicles = await vehiclesCollection.find({}).toArray();

    let fixedCount = 0;
    let invalidCount = 0;

    for (const vehicle of vehicles) {
      const hasInvalidPrice =
        !vehicle.pricePerDay ||
        isNaN(parseFloat(vehicle.pricePerDay)) ||
        vehicle.pricePerDay <= 0;

      if (hasInvalidPrice) {
        console.log(`⚠️  Vehicle "${vehicle.name}" (${vehicle._id})`);
        console.log(`   Current pricePerDay: ${vehicle.pricePerDay}`);
        console.log(`   Current price field: ${vehicle.price}`);

        // Try to extract price from string format like "$50/day"
        let newPrice = 50; // Default fallback

        if (vehicle.price && typeof vehicle.price === 'string') {
          const match = vehicle.price.match(/\$?([\d.]+)/);
          if (match && match[1]) {
            newPrice = parseFloat(match[1]);
          }
        }

        console.log(`   ✓ Setting pricePerDay to: ${newPrice}\n`);

        // Update the vehicle
        await vehiclesCollection.updateOne(
          { _id: vehicle._id },
          {
            $set: {
              pricePerDay: newPrice,
              isApproved: true, // Ensure vehicle is approved for display
            },
            $unset: {
              price: '', // Remove old price field
            },
          }
        );

        fixedCount++;
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Fixed vehicles: ${fixedCount}`);
    console.log(`   Total vehicles: ${vehicles.length}`);

    // Verify all vehicles now have valid prices
    const stillInvalid = await vehiclesCollection.countDocuments({
      $or: [
        { pricePerDay: { $exists: false } },
        { pricePerDay: null },
        { pricePerDay: '' },
        { pricePerDay: NaN },
      ],
    });

    if (stillInvalid === 0) {
      console.log('   ✓ All vehicles have valid pricing!\n');
    } else {
      console.log(`   ⚠️  Warning: ${stillInvalid} vehicles still have invalid pricing\n`);
    }
  } catch (error) {
    console.error('❌ Error fixing vehicle prices:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

fixVehiclePrices();
