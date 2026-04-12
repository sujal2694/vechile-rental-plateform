const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  searchVehicles,
} = require('../controllers/vehicleController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        '-' +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG, GIF) are allowed!'));
    }
  },
});

// Public routes
router.get('/', getAllVehicles); // Get all approved vehicles with pagination
router.get('/search', searchVehicles); // Search vehicles (must be before /:id)
router.get('/:id', getVehicleById); // Get single vehicle

// Admin-only routes
router.post('/', adminMiddleware, upload.single('image'), createVehicle); // Create vehicle
router.put('/:id', adminMiddleware, upload.single('image'), updateVehicle); // Update vehicle
router.delete('/:id', adminMiddleware, deleteVehicle); // Delete vehicle

module.exports = router;