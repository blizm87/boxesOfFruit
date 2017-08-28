const express = require('express');
const router = express.Router();
const member = require('../models/authenticatedUsers.js');


router.get('/', (req, res, next) => {
  member.findOne({_id: req.query.profileId}, (err, profileData) => {
    console.log(profileData);
    res.json({data: profileData});
  })
});

module.exports = router
