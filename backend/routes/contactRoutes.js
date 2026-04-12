const express = require('express');
const { submitContact, getAllContacts, updateContactStatus } = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', submitContact);
router.get('/', authMiddleware, getAllContacts);
router.put('/:id/status', authMiddleware, updateContactStatus);

module.exports = router;