const validator = require('validator');
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const {
  validateEmail,
  validatePhone,
  sanitizeInput,
} = require('../middleware/validators');

/**
 * Submit a contact form message
 */
const submitContact = async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, subject, and message are required',
      });
    }

    // Validate email
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Validate phone if provided
    if (phone) {
      const phoneValidation = validatePhone(phone);
      if (!phoneValidation.valid) {
        return res.status(400).json({
          success: false,
          message: phoneValidation.message,
        });
      }
    }

    // Validate message length
    if (message.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 10 characters long',
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot exceed 2000 characters',
      });
    }

    const db = getDB();

    const newContact = {
      fullName: sanitizeInput(fullName),
      email: email.toLowerCase(),
      phone: phone ? sanitizeInput(phone) : '',
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
      status: 'new',
      priority: 'low',
      assignedTo: null,
      reply: '',
      repliedAt: null,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('contacts').insertOne(newContact);

    res.status(201).json({
      success: true,
      message: 'Message submitted successfully. We will contact you soon!',
      contact: { id: result.insertedId, ...newContact },
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit message. Please try again.',
    });
  }
};

/**
 * Get all contacts (ADMIN ONLY)
 */
const getAllContacts = async (req, res) => {
  try {
    const db = getDB();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by priority
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    // Get total count
    const total = await db.collection('contacts').countDocuments(query);

    // Get paginated contacts
    const contacts = await db
      .collection('contacts')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({
      success: true,
      contacts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
    });
  }
};

/**
 * Update contact status (ADMIN ONLY)
 */
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, reply, assignedTo, tags } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID',
      });
    }

    const allowedStatuses = ['new', 'in-progress', 'resolved', 'closed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const db = getDB();

    const updateData = {
      status,
      updatedAt: new Date(),
    };

    // Optional updates
    if (priority) {
      const allowedPriorities = ['low', 'medium', 'high', 'urgent'];
      if (allowedPriorities.includes(priority)) {
        updateData.priority = priority;
      }
    }

    if (reply) {
      updateData.reply = sanitizeInput(reply);
      updateData.repliedAt = new Date();
    }

    if (assignedTo) {
      if (ObjectId.isValid(assignedTo)) {
        updateData.assignedTo = new ObjectId(assignedTo);
      }
    }

    if (tags && Array.isArray(tags)) {
      updateData.tags = tags.map(sanitizeInput);
    }

    const result = await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.json({
      success: true,
      message: 'Contact updated successfully',
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact',
    });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
  updateContactStatus,
};