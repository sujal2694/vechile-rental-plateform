/**
 * MongoDB Schema Definitions
 * These define the structure for collections but don't enforce validation at DB level
 * Use these as reference for your data structure
 */

module.exports = {
  User: require('./User'),
  Vehicle: require('./Vehicle'),
  Booking: require('./Booking'),
  Contact: require('./Contact'),
};
