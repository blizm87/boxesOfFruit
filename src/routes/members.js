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
    if(req.body.bucketOne.playerAnswer === req.body.bucketOne.value &&
      req.body.bucketTwo.playerAnswer === req.body.bucketTwo.value &&
      req.body.bucketThree.playerAnswer === req.body.bucketThree.value){

        let gameRecordResults = {
          submittedAnswers: [req.body.bucketOne.playerAnswer, req.body.bucketTwo.playerAnswer, req.body.bucketThree.playerAnswer],
          correctAnswers: [req.body.bucketOne.value, req.body.bucketTwo.value, req.body.bucketThree.value],
          result: 'Win'
        }
        profile.score.gameRecords.push(gameRecordResults);
        profile.score.gamesPlayed += 1;
        profile.score.gamesWon += 1;
        profile.save();
        res.json({data: {
          header: `GREAT JOB, ${profile.fullName}`,
          cont: 'You were right!!! You Won!!!',
          bckImage: '../assets/wallpapers/peaceful.jpg',
          color: 'white'
        }})
    } else {
      let gameRecordResults = {
        submittedAnswers: [req.body.bucketOne.playerAnswer, req.body.bucketTwo.playerAnswer, req.body.bucketThree.playerAnswer],
        correctAnswers: [req.body.bucketOne.value, req.body.bucketTwo.value, req.body.bucketThree.value],
        result: 'Lose'
      }
      profile.score.gameRecords.push(gameRecordResults);
      profile.score.gamesPlayed += 1;

      profile.save();
      res.json({data: {
        header: 'TOO BAD, WHOEVER YOU ARE',
        cont: 'You were wrong!!! Try Again!!!',
        bckImage: '../assets/wallpapers/flames.jpeg',
        color: 'black'
      }});
    }
  })

})

module.exports = router
