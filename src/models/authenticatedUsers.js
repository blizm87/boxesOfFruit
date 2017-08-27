var mongoose = require('mongoose');

var memberSchema = new mongoose.Schema({
  'fullName': String,
  'email': { type: String, required: true },
  'myId': String,
  'submittedAnswers': [],
  'correctAnswers': [],
  createdAt: { type: Date, default: Date.now }
});

var member = mongoose.model('Users', memberSchema);

module.exports = member;
