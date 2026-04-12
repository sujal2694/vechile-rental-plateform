const express = require('express');
const multer = require('multer');
const path = require('path');
const { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle, searchVehicles } = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

router.get('/', getAllVehicles);
router.get('/search', searchVehicles);   // Must be before /:id
router.get('/:id', getVehicleById);
router.post('/', authMiddleware, upload.single('image'), createVehicle);
router.put('/:id', authMiddleware, upload.single('image'), updateVehicle);
router.delete('/:id', authMiddleware, deleteVehicle);

module.exports = router;