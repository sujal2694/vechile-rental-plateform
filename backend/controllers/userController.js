const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const { validatePhone, sanitizeInput } = require('../middleware/validators');

/**
 * Get user profile
 */
const getUserProfile = async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne({
      _id: new ObjectId(req.user.userId),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Exclude password from response
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    });
  }
};

/**
 * Update user profile
 */
const updateUserProfile = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;
    const db = getDB();

    const updateData = {};

    // Validate and sanitize fullName
    if (fullName !== undefined) {
      const name = sanitizeInput(fullName);
      if (name.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Full name must be at least 2 characters',
        });
      }
      updateData.fullName = name;
    }

    // Validate phone (optional)
    if (phone !== undefined) {
      const phoneValidation = validatePhone(phone);
      if (!phoneValidation.valid) {
        return res.status(400).json({
          success: false,
          message: phoneValidation.message,
        });
      }
      updateData.phone = phone;
    }

    // Sanitize address
    if (address !== undefined) {
      const sanitizedAddress = sanitizeInput(address);
      if (sanitizedAddress.length > 200) {
        return res.status(400).json({
          success: false,
          message: 'Address cannot exceed 200 characters',
        });
      }
      updateData.address = sanitizedAddress;
    }

    // Ensure at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided to update',
      });
    }

    updateData.updatedAt = new Date();

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.user.userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};

module.exports = { getUserProfile, updateUserProfile };