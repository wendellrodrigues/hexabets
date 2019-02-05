const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;


// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

/**
 * Hashes password when entering into database
 * Happens before .save in controller
 */
UserSchema.pre('save', async function(next){
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Generate a password hash (salt + hash)
    const passwordHash = await bcrypt.hash(this.password, salt);

    // Reassign password to hashed password
    this.password = passwordHash;

    //Call next
    next();

  } catch(err) {
      next(err);
  }
});

/**
 * Checks login validation of password
 */
UserSchema.methods.isValidPassword = async function(passwordAttempt) {
  try {
    return await bcrypt.compare(passwordAttempt, this.password);
  } catch(err) {
    throw new Error(err);
  }
}


module.exports = User = mongoose.model('users', UserSchema);

