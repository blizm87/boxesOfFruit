require('./config');

const authUser = require('../models/authenticatedUsers.js')

var devAdmin = new authUser({
  fullName: 'Justin Samuels',
  email: 'fldjfkls@gmail.com',
  myId: '1234567890',
  score: {
    gamesPlayed: 1,
    gamesWon: 1,
    gameRecords: [{
      submittedAnswers: ['apple', 'orange', 'mixed'],
      correctAnswers: ['apple', 'orange', 'mixed']
    }]
  }
})

devAdmin.save();
