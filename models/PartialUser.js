const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 *  PartialUser
 *  Partial Users are users that have just signed up and have
 */
const PartialUserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobilePhone: {
    type: String,
    required: true
  },

  phoneVerified: {
    type: Boolean,
    default: false,
    required: true
  }, 

  phoneVerificationID: {
    type: String,
    default: '',
  }
 
});

module.exports = PartialUser = mongoose.model('partialUsers', PartialUserSchema);