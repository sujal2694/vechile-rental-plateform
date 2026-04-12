const express = require('express');
const {
  submitContact,
  getAllContacts,
  updateContactStatus,
} = require('../controllers/contactController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', submitContact); // Public - submit contact form
router.get('/', adminMiddleware, getAllContacts); // Admin only - view all contacts
router.put('/:id/status', adminMiddleware, updateContactStatus); // Admin only - update status

module.exports = router;