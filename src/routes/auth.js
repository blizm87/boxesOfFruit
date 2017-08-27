const express = require('express');
const router = express.Router();
const request = require('request');
const googleAuthUser = require('../models/authenticatedUsers.js');


const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;

// GOOGLE AUTHENTICATION
router.get('/google', (req, res, next) => {
  if(process.env.NODE_ENV === 'production') {
    var redirect_uri = 'https://nameless-brook-20005.herokuapp.com/auth/google/callback';
  } else {
    var redirect_uri = 'http://127.0.0.1:3000/auth/google/callback';
  }

  const url = 'https://accounts.google.com/o/oauth2/v2/auth';
  const queryParams = `response_type=code&client_id=${client_id}&scope=email&state=abc&redirect_uri=${redirect_uri}`;
  res.redirect(url + '?' + queryParams);
});

router.get('/google/callback', (req, res, next) => {
  if(process.env.NODE_ENV === 'production') {
    var redirect_uri = 'https://nameless-brook-20005.herokuapp.com/auth/google/callback'
  } else {
    var redirect_uri = 'http://127.0.0.1:3000/auth/google/callback';
  }
  const {code, state} = req.query;
  let url = 'https://www.googleapis.com/oauth2/v4/token';
  const form = {
    code,
    client_id,
    client_secret,
    redirect_uri,
    grant_type: 'authorization_code'
  }
  request.post(url, {form}, (err, resp, body) => {
    const data = JSON.parse(body);
    url = 'https://www.googleapis.com/plus/v1/people/me';
    const access_token = data.access_token;
    const options = {
      method: 'GET',
      url,
      headers: { 'Authorization' : `Bearer ${access_token}`}
    }
    request(options, (err, response, body2) => {
      const userInfo = JSON.parse(body2);
      // console.log('I AM THE USERINFO: ');
      // console.log(userInfo);
      googleAuthUser.findOne( {email: userInfo.emails[0].value}, (err, user) => {
        if(user === null) {
          let newUser = new googleAuthUser({
            fullName: userInfo.displayName,
            email: userInfo.emails[0].value,
            myId: userInfo.id,
            score: {
              gamesPlayed: 0,
              gamesWon: 0,
              gameRecords: []
            }
          })

          newUser.save();
        }
      }).then( () => {
          googleAuthUser.findOne( {email: userInfo.emails[0].value}, (err, accountUser) => {
            if(process.env.NODE_ENV === 'production') {
              res.redirect(`https://afternoon-cliffs-80859.herokuapp.com/#!/game`);
            } else {
              res.redirect(`http://127.0.0.1:3000/#!/game?profileId=${accountUser._id}`);
            }
          })
      });
    });
  });
});

module.exports = router;
