// MongoDB commands to fix vehicle pricing
// Run these in MongoDB Compass or mongosh console

// 1. Check the problematic vehicle
db.vehicles.findOne({ _id: ObjectId("69da1c1bb47c8630e6479b1c") })

// 2. Fix the specific vehicle that's failing
db.vehicles.updateOne(
  { _id: ObjectId("69da1c1bb47c8630e6479b1c") },
  { $set: { pricePerDay: 50, isApproved: true } }
)

// 3. Fix ALL vehicles with missing or invalid pricePerDay
db.vehicles.updateMany(
  {
    $or: [
      { pricePerDay: { $exists: false } },
      { pricePerDay: null },
      { pricePerDay: "" }
    ]
  },
  { 
    $set: { 
      pricePerDay: 50,  // Default price, adjust if needed
      isApproved: true 
    },
    $unset: { price: "" }  // Remove old string price field
  }
)

// 4. Convert string prices to numbers if they exist
// For each vehicle with a string price like "$50/day", extract the number
db.vehicles.updateMany(
  { price: { $type: "string", $regex: /\$/ } },
  [
    {
      $set: {
        pricePerDay: {
          $toInt: {
            $arrayElemAt: [
              { $split: [{ $substr: ["$price", 1, { $strLenCP: "$price" }] }, "/"] },
              0
            ]
          }
        },
        isApproved: true
      }
    }
  ]
)

// 5. Verify all vehicles now have valid prices
db.vehicles.find({ 
  $or: [
    { pricePerDay: { $exists: false } },
    { pricePerDay: null },
    { pricePerDay: { $lte: 0 } }
  ]
})

// 6. View all vehicles with their prices (should show all with numeric pricePerDay)
db.vehicles.find({}, { name: 1, pricePerDay: 1, isApproved: 1 }).pretty()
