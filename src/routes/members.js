const express = require('express');
const router = express.Router();
const member = require('../models/authenticatedUsers.js');


router.get('/', (req, res, next) => {
  member.findOne({_id: req.query.profileId}, (err, profileData) => {
    // console.log(profileData);
    res.json({data: profileData});
  })
});

router.post('/game', (req, res, next) => {
  console.log('TESTING FORM SUBMISSION')
  member.findOne({email: req.body.email}, (err, profile) => {
    console.log(profile)
    let gameRecordResults = {
      submittedAnswers: [req.body.bucketOne.playerAnswer, req.body.bucketTwo.playerAnswer, req.body.bucketThree.playerAnswer],
      correctAnswers: [req.body.bucketOne.value, req.body.bucketTwo.value, req.body.bucketThree.value]
    }
    console.log(gameRecordResults)
    // player.score.gameRecords.push(gameRecordResults);
    // player.score.gamesPlayed += 1;
    res.json({data: 'Testing Win Game Response'})
  })

})

module.exports = router
