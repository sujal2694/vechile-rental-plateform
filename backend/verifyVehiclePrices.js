require('dotenv').config();
const { MongoClient } = require('mongodb');

async function checkAllVehicles() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();
    const vehiclesCollection = db.collection('vehicles');

    console.log('📊 VEHICLE PRICING CHECK\n');

    // Get all vehicles
    const vehicles = await vehiclesCollection.find({}).toArray();
    console.log(`✅ Total vehicles: ${vehicles.length}\n`);

    console.log('🚗 Vehicle Details:');
    console.log('─────────────────────────────────────────────────────────');
    
    let validCount = 0;
    let invalidCount = 0;

    vehicles.forEach((v, i) => {
      const price = v.pricePerDay;
      const isValid = price && typeof price === 'number' && price > 0;
      const status = isValid ? '✅ VALID' : '❌ INVALID';
      
      if (isValid) validCount++;
      else invalidCount++;

      console.log(
        `${i + 1}. ${status} | ${v.name}\n` +
        `   Price: $${price}/day | Category: ${v.category} | Approved: ${v.isApproved}`
      );
    });

    console.log('─────────────────────────────────────────────────────────');
    console.log(`\n📈 Summary:`);
    console.log(`   ✅ Valid prices: ${validCount}`);
    console.log(`   ❌ Invalid prices: ${invalidCount}`);

    if (invalidCount === 0) {
      console.log('\n✅ ALL VEHICLES READY FOR CHECKOUT!');
      console.log('\n🎯 Next steps:');
      console.log('   1. Go to client frontend');
      console.log('   2. Browse vehicles');
      console.log('   3. Add to cart and proceed to checkout');
      console.log('   4. Test Stripe payment flow');
    } else {
      console.log('\n⚠️  Some vehicles still have invalid pricing - migration needed');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkAllVehicles();
