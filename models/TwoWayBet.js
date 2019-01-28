const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TwoWayBetSchema = new Schema({
  firstUser: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  secondUser: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  firstUserAmount: {
    type: Number,
    required: true
  },
  secondUserAmount: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  firstUserAccepted : {
    type: Boolean,
    default: false
  },
  secondUserAccepted : {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('bets', TwoWayBetSchema);

