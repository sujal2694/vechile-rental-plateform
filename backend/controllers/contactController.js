const validator = require('validator');
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const submitContact = async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    if (phone && !validator.isMobilePhone(phone, 'any')) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }

    const db = getDB();
    const newContact = {
      fullName,
      email,
      phone: phone || '',
      subject,
      message,
      status: 'new',
      createdAt: new Date(),
    };

    const result = await db.collection('contacts').insertOne(newContact);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. We will contact you soon!',
      contact: { id: result.insertedId, ...newContact },
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const db = getDB();
    const contacts = await db.collection('contacts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, contacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch contacts' });
  }
};

const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const allowedStatuses = ['new', 'in-progress', 'resolved'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowedStatuses.join(', ')}` });
    }

    const db = getDB();
    const result = await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, message: 'Contact status updated' });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ success: false, message: 'Failed to update contact' });
  }
};

module.exports = { submitContact, getAllContacts, updateContactStatus };