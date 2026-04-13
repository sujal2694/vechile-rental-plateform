const { MongoClient } = require('mongodb');
require('dotenv').config();

const sampleVehicles = [
  {
    name: "Toyota Camry",
    category: "Standard",
    image: "/uploads/vehicles/toyota-camry.jpg",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 50,
    rating: 4.5,
    isApproved: true,
    createdAt: new Date()
  },
  {
    name: "Honda CR-V",
    category: "SUV",
    image: "/uploads/vehicles/honda-crv.jpg",
    seats: 7,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 70,
    rating: 4.7,
    isApproved: true,
    createdAt: new Date()
  },
  {
    name: "BMW 3 Series",
    category: "Premium",
    image: "/uploads/vehicles/bmw-3.jpg",
    seats: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    pricePerDay: 120,
    rating: 4.9,
    isApproved: true,
    createdAt: new Date()
  },
  {
    name: "Toyota Innova",
    category: "SUV",
    image: "/uploads/vehicles/toyota-innova.jpg",
    seats: 8,
    transmission: "Manual",
    fuel: "Diesel",
    pricePerDay: 65,
    rating: 4.4,
    isApproved: true,
    createdAt: new Date()
  },
  {
    name: "Hyundai i20",
    category: "Economy",
    image: "/uploads/vehicles/hyundai-i20.jpg",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    pricePerDay: 35,
    rating: 4.2,
    isApproved: true,
    createdAt: new Date()
  },
  {
    name: "Tesla Model 3",
    category: "Premium",
    image: "/uploads/vehicles/tesla-model3.jpg",
    seats: 5,
    transmission: "Automatic",
    fuel: "Electric",
    pricePerDay: 150,
    rating: 4.8,
    isApproved: true,
    createdAt: new Date()
  },
  {
    name: "Audi A4",
    category: "Luxury",
    image: "/uploads/vehicles/audi-a4.jpg",
    seats: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    pricePerDay: 130,
    rating: 4.9,
    isApproved: true,
    createdAt: new Date()
  }
];

async function seedDatabase() {
  let client;
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle_rental';
    console.log('🔄 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    
    await client.connect();
    const db = client.db();
    const vehiclesCollection = db.collection('vehicles');

    // Clear existing data
    await vehiclesCollection.deleteMany({});
    console.log('✅ Cleared existing vehicles\n');

    // Insert new data
    const result = await vehiclesCollection.insertMany(sampleVehicles);
    console.log(`✅ Inserted ${result.insertedCount} vehicles\n`);

    // Display inserted vehicles
    console.log('🚗 Seeded Vehicles:');
    const vehicles = await vehiclesCollection.find({}).toArray();
    vehicles.forEach((v, i) => {
      console.log(`${i + 1}. ${v.name} - $${v.pricePerDay}/day (${v.category}, ${v.seats} seats)`);
    });

    console.log('\n✅ Database seeding complete!');

  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    process.exit(1);
  } finally {
    if (client) await client.close();
  }
}

seedDatabase();
