var mongoose = require('mongoose');

var memberSchema = new mongoose.Schema({
  'fullName': String,
  'email': { type: String, required: true },
  'score': {
    gamesPlayed: Number,
    gamesWon: Number,
    gameRecords: []
  },
  createdAt: { type: Date, default: Date.now }
});

var member = mongoose.model('userAccounts', memberSchema);

module.exports = member;
