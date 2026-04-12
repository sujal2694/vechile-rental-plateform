const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const getAllVehicles = async (req, res) => {
  try {
    const db = getDB();
    const vehicles = await db.collection('vehicles').find({}).toArray();

    res.json({ success: true, vehicles });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch vehicles' });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const vehicle = await db.collection('vehicles').findOne({ _id: new ObjectId(id) });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.json({ success: true, vehicle });
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch vehicle' });
  }
};

const createVehicle = async (req, res) => {
  try {
    const { name, category, seats, transmission, fuel, price, rating } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const db = getDB();
    const newVehicle = {
      name,
      category,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      seats: seats || 4,
      transmission: transmission || 'Automatic',
      fuel: fuel || 'Petrol',
      price,
      rating: rating || 4.5,
      createdAt: new Date(),
    };

    const result = await db.collection('vehicles').insertOne(newVehicle);

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      vehicle: { id: result.insertedId, ...newVehicle },
    });
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ success: false, message: 'Failed to create vehicle' });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, ...safeUpdateData } = req.body;

    // If a new image is uploaded, add it to the update data
    if (req.file) {
      safeUpdateData.image = `/uploads/${req.file.filename}`;
    }

    if (Object.keys(safeUpdateData).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields provided to update' });
    }

    const db = getDB();
    const result = await db.collection('vehicles').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...safeUpdateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.json({ success: true, message: 'Vehicle updated successfully' });
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ success: false, message: 'Failed to update vehicle' });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const result = await db.collection('vehicles').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete vehicle' });
  }
};

const searchVehicles = async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    const db = getDB();

    let query = {};
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const vehicles = await db.collection('vehicles').find(query).toArray();

    res.json({ success: true, vehicles });
  } catch (error) {
    console.error('Search vehicles error:', error);
    res.status(500).json({ success: false, message: 'Failed to search vehicles' });
  }
};

module.exports = { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle, searchVehicles };