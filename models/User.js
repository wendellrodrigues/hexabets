const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;


// Create Schema
const UserSchema = new Schema({

  method: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    required: true
  },

  friends: [
    {
      friendID: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      status: {
        type: String,
        enum: ['requested', 'pending', 'accepted']
      },
      addedWhen: {
        type: Date
      }
    }
  ],

  local: {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now
    }
  },

  facebook: {
    id: {
      type: String
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true
    }
  },

});

/**
 * Hashes password when entering into database
 * Happens before .save in controller
 */
UserSchema.pre('save', async function(next){

  if(this.method !== 'local') {
    next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    const localPassword = this.local.password;

    // Generate a password hash (salt + hash)
    const passwordHash = await bcrypt.hash(localPassword, salt);

    // Reassign password to hashed password
    this.local.password = passwordHash;

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
    return await bcrypt.compare(passwordAttempt, this.local.password);
  } catch(err) {
    throw new Error(err);
  }
}

module.exports = User = mongoose.model('users', UserSchema);
















// /**
//  * Adds locally found friend to User Schema
//  */
// UserSchema.methods.addFriend = async function(localFriend, status) {
//   try {

//     const friendToAdd = {
//       status: status,
//       addedWhen: Date.now,
//       friend: localFriend
//     }

//     this.friends.push(friendToAdd);

//     console.log(this)

//   } catch(err) {
//     throw new Error(err);
//   }
// }

