require('dotenv').config();
const fetch = require('node-fetch');

console.log('🔍 Payment Flow Diagnostic\n');

// Check configuration
console.log('📋 Configuration Check:');
console.log(`  STRIPE_SECRET_KEY: ${process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing'}`);
console.log(`  MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
console.log(`  SERVER_URL: ${process.env.SERVER_URL || 'Not set (using default)'}`);
console.log();

// Test 1: Check if API is accessible
async function testAPI() {
  console.log('🌐 API Connection Test:');
  try {
    const response = await fetch('http://localhost:5000/api/vehicles');
    console.log(`  Status: ${response.status}`);
    if (response.status === 200) {
      console.log('  ✅ API is reachable');
    } else {
      console.log('  ❌ API returned error status');
    }
  } catch (err) {
    console.log(`  ❌ Cannot reach API: ${err.message}`);
  }
  console.log();
}

// Test 2: Check if Stripe is configured
function testStripe() {
  console.log('💳 Stripe Configuration:');
  const key = process.env.STRIPE_SECRET_KEY;
  
  if (!key) {
    console.log('  ❌ STRIPE_SECRET_KEY not set');
    return;
  }
  
  if (key.includes('sk_test_')) {
    console.log('  ✅ Test key detected');
  } else if (key.includes('sk_live_')) {
    console.log('  ✅ Live key detected (use with caution!)');
  } else {
    console.log('  ⚠️  Invalid key format');
  }
  
  console.log();
}

// Test 3: Check MongoDB connection
async function testMongoDB() {
  console.log('🗄️  MongoDB Connection:');
  try {
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle_rental');
    await client.connect();
    
    const db = client.db();
    const vehicles = await db.collection('vehicles').countDocuments();
    console.log(`  ✅ Connected to MongoDB`);
    console.log(`  ✅ Vehicles in database: ${vehicles}`);
    
    await client.close();
  } catch (err) {
    console.log(`  ❌ MongoDB error: ${err.message}`);
  }
  console.log();
}

// Run tests
async function runDiagnostics() {
  await testAPI();
  testStripe();
  await testMongoDB();
  
  console.log('💡 Troubleshooting Guide:');
  console.log('  1. Is backend running? npm start (in backend directory)');
  console.log('  2. Is frontend running? npm run dev (in client directory)');
  console.log('  3. Check browser console for errors (F12)');
  console.log('  4. Check backend terminal for error logs');
  console.log('  5. Ensure MongoDB Atlas connection is working');
}

runDiagnostics();
