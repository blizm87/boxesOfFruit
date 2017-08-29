require('./config');

const authUser = require('../models/authenticatedUsers.js')

var devAdmin = new authUser({
  fullName: 'Kyle',
  email: 'fldjfkls@gmail.com',
  myId: '1234567890',
  score: {
    gamesPlayed: 1,
    gamesWon: 1,
    gameRecords: [{
      submittedAnswers: ['APPLE', 'ORANGE', 'MIXED'],
      correctAnswers: ['APPLE', 'ORANGE', 'MIXED'],
      result: 'Win'
    }]
  }
})

devAdmin.save();
