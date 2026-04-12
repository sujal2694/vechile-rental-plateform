// Sample vehicle data that can be inserted into MongoDB
// Use MongoDB Compass or this script to seed the database

const sampleVehicles = [
  {
    name: "Toyota Camry",
    category: "Sedan",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    price: "$50/day",
    rating: 4.5,
    createdAt: new Date()
  },
  {
    name: "Honda CR-V",
    category: "SUV",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400",
    seats: 7,
    transmission: "Automatic",
    fuel: "Petrol",
    price: "$70/day",
    rating: 4.7,
    createdAt: new Date()
  },
  {
    name: "BMW 3 Series",
    category: "Luxury",
    image: "https://images.unsplash.com/photo-1618405959076-a08ab6a6b10b?w=400",
    seats: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    price: "$120/day",
    rating: 4.9,
    createdAt: new Date()
  },
  {
    name: "Toyota Innova",
    category: "SUV",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c3dec1435?w=400",
    seats: 8,
    transmission: "Manual",
    fuel: "Diesel",
    price: "$65/day",
    rating: 4.4,
    createdAt: new Date()
  },
  {
    name: "Hyundai i20",
    category: "Hatchback",
    image: "https://images.unsplash.com/photo-1600584518198-40694512141d?w=400",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    price: "$35/day",
    rating: 4.2,
    createdAt: new Date()
  },
  {
    name: "Maruti Swift",
    category: "Hatchback",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    price: "$30/day",
    rating: 4.3,
    createdAt: new Date()
  },
  {
    name: "Tesla Model 3",
    category: "Electric",
    image: "https://images.unsplash.com/photo-1617469779029-23cf4691cd51?w=400",
    seats: 5,
    transmission: "Automatic",
    fuel: "Electric",
    price: "$150/day",
    rating: 4.8,
    createdAt: new Date()
  },
  {
    name: "Ford EcoSport",
    category: "SUV",
    image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    price: "$55/day",
    rating: 4.1,
    createdAt: new Date()
  },
  {
    name: "Audi A4",
    category: "Luxury",
    image: "https://images.unsplash.com/photo-1619405959076-a08ab6a6b10b?w=400",
    seats: 5,
    transmission: "Automatic",
    fuel: "Diesel",
    price: "$130/day",
    rating: 4.9,
    createdAt: new Date()
  },
  {
    name: "MG Hector",
    category: "SUV",
    image: "https://images.unsplash.com/photo-1569163139394-de4798aa62b2?w=400",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    price: "$75/day",
    rating: 4.6,
    createdAt: new Date()
  }
];

module.exports = sampleVehicles;

/*
  To use this data:
  
  METHOD 1: Using MongoDB Compass
  1. Copy the array from sampleVehicles
  2. Open MongoDB Compass
  3. Select vehicle_rental database > vehicles collection
  4. Click "Insert Document" and paste the data
  
  METHOD 2: Using Node.js script (create seedData.js)
  const { MongoClient } = require('mongodb');
  const sampleVehicles = require('./seedData');
  
  async function seedDatabase() {
    const client = new MongoClient('mongodb://localhost:27017');
    
    try {
      await client.connect();
      const db = client.db('vehicle_rental');
      
      const result = await db.collection('vehicles').insertMany(sampleVehicles);
      console.log(`${result.insertedCount} vehicles inserted`);
    } finally {
      await client.close();
    }
  }
  
  seedDatabase();
  
  Then run: node seedData.js
  
  METHOD 3: Using curl
  curl -X POST http://localhost:5000/api/vehicles \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -d '{ "name": "Toyota Camry", "category": "Sedan", ... }'
*/
