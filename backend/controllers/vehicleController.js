const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const { validateVehicleData, validatePrice, sanitizeInput } = require('../middleware/validators');


const getAllVehicles = async (req, res) => {
  try {
    const db = getDB();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10); // Max 50 per page
    const skip = (page - 1) * limit;

    let query = {
      $or: [
        { isApproved: true },
        { isApproved: { $exists: false } }
      ]
    };

    // Filter by category
    if (req.query.category) {
      query.category = sanitizeInput(req.query.category).toLowerCase();
    }

    // Text search by name
    if (req.query.search) {
      query.$text = { $search: sanitizeInput(req.query.search) };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.pricePerDay = {};
      if (req.query.minPrice) {
        query.pricePerDay.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.pricePerDay.$lte = parseFloat(req.query.maxPrice);
      }
    }

    // Get total count
    const total = await db.collection('vehicles').countDocuments(query);

    // Get paginated results
    const vehicles = await db
      .collection('vehicles')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({
      success: true,
      vehicles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicles',
    });
  }
};

/**
 * Get single vehicle by ID
 */
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle ID',
      });
    }

    const db = getDB();
    const vehicle = await db.collection('vehicles').findOne({
      _id: new ObjectId(id),
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.json({ success: true, vehicle });
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicle',
    });
  }
};

/**
 * Create a new vehicle (ADMIN ONLY)
 */
const createVehicle = async (req, res) => {
  try {
    const { name, category, description, seats, transmission, fuel, year, pricePerDay, features } =
      req.body;

    // Validate required fields
    if (!name || !category || !pricePerDay) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and price are required',
      });
    }

    // Validate vehicle data
    const validation = validateVehicleData(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join('; '),
      });
    }

    const priceValidation = validatePrice(pricePerDay);
    if (!priceValidation.valid) {
      return res.status(400).json({
        success: false,
        message: priceValidation.message,
      });
    }

    const db = getDB();

    const newVehicle = {
      name: sanitizeInput(name),
      category: category.toLowerCase(),
      description: sanitizeInput(description || ''),
      image: req.file ? `/uploads/${req.file.filename}` : '',
      images: [],
      seats: parseInt(seats) || 4,
      transmission: transmission || 'Automatic',
      fuel: fuel || 'Petrol',
      mileage: 0,
      year: year ? parseInt(year) : new Date().getFullYear(),
      pricePerDay: priceValidation.price,
      pricePerHour: null,
      rating: 4.5,
      reviewCount: 0,
      availability: true,
      features: Array.isArray(features) ? features.map(sanitizeInput) : [],
      isApproved: true,
      createdBy: new ObjectId(req.user.userId),
      createdAt: new Date(),
      updatedAt: new Date(),
      bookingCount: 0,
    };

    const result = await db.collection('vehicles').insertOne(newVehicle);

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully. Awaiting admin approval.',
      vehicle: { id: result.insertedId, ...newVehicle },
    });
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create vehicle',
    });
  }
};

/**
 * Update vehicle (ADMIN ONLY)
 */
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle ID',
      });
    }

    // Remove sensitive fields from update
    const { _id, createdAt, createdBy, ...updateData } = req.body;

    // Validate fields if provided
    if (Object.keys(updateData).length === 0 && !req.file) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided to update',
      });
    }

    // Add new image if uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Sanitize string inputs
    for (const key in updateData) {
      if (typeof updateData[key] === 'string') {
        updateData[key] = sanitizeInput(updateData[key]);
      }
    }

    updateData.updatedAt = new Date();

    const db = getDB();
    const result = await db.collection('vehicles').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
    });
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vehicle',
    });
  }
};

/**
 * Delete vehicle (ADMIN ONLY)
 */
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle ID',
      });
    }

    const db = getDB();

    const result = await db.collection('vehicles').deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    res.json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete vehicle',
    });
  }
};

/**
 * Search vehicles with filters
 */
const searchVehicles = async (req, res) => {
  try {
    const db = getDB();
    let query = {
      $or: [
        { isApproved: true },
        { isApproved: { $exists: false } }
      ]
    };

    // Category filter
    if (req.query.category) {
      query.category = req.query.category.toLowerCase();
    }

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.pricePerDay = {};
      if (req.query.minPrice) {
        query.pricePerDay.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.pricePerDay.$lte = parseFloat(req.query.maxPrice);
      }
    }

    // Availability
    if (req.query.availability === 'true') {
      query.availability = true;
    }

    const vehicles = await db
      .collection('vehicles')
      .find(query)
      .limit(50)
      .toArray();

    res.json({ success: true, vehicles });
  } catch (error) {
    console.error('Search vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search vehicles',
    });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  searchVehicles,
};