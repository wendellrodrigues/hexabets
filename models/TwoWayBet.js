const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Different types of user schemas, try to see if different ones work (ie firstUser, secondUser)
const TwoWayBetSchema = new Schema({

  firstUser: {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    amount: {
      type: Number,
      required: true
    },
    accepted: {
      type: Boolean,
      default: false
    }
  },

  secondUser: ({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    amount: {
      type: Number,
      required: true
    },
    accepted: {
      type: Boolean,
      default: false
    }
  }),

  totalAmount: {
    type: Number,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  },

});

module.exports = User = mongoose.model('bets', TwoWayBetSchema);




















// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// // Create Schema
// const TwoWayBetSchema = new Schema({
//   firstUser: {
//     type: Schema.Types.ObjectId,
//     ref: 'users'
//   },
//   secondUser: {
//     type: Schema.Types.ObjectId,
//     ref: 'users'
//   },
//   firstUserAmount: {
//     type: Number,
//     required: true
//   },
//   secondUserAmount: {
//     type: Number,
//     required: true
//   },
//   totalAmount: {
//     type: Number,
//     required: true
//   },
//   firstUserAccepted : {
//     type: Boolean,
//     default: false
//   },
//   secondUserAccepted : {
//     type: Boolean,
//     default: false
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   },

//   firstUser: ({
//     User: {

//     },
//   })


// });

// module.exports = User = mongoose.model('bets', TwoWayBetSchema);

