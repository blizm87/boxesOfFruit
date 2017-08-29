const express = require('express');
const router = express.Router();
const request = require('request');
const googleAuthUser = require('../models/authenticatedUsers.js');
const validator = require('mailgun-email-validation');

const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;
const mailboxlayer_apikey = process.env.MAILBOXLAYER_APIKEY;

// GOOGLE AUTHENTICATION
router.get('/google', (req, res, next) => {
  if(process.env.NODE_ENV === 'production') {
    var redirect_uri = 'https://thawing-tor-23519.herokuapp.com/auth/google/callback';
  } else {
    var redirect_uri = 'http://127.0.0.1:3000/auth/google/callback';
  }

  const url = 'https://accounts.google.com/o/oauth2/v2/auth';
  const queryParams = `response_type=code&client_id=${client_id}&scope=email&state=abc&redirect_uri=${redirect_uri}`;
  res.redirect(url + '?' + queryParams);
});

router.get('/google/callback', (req, res1, next) => {
  if(process.env.NODE_ENV === 'production') {
    var redirect_uri = 'https://thawing-tor-23519.herokuapp.com/auth/google/callback'
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
              res1.redirect(`https://thawing-tor-23519.herokuapp.com/#!/game`);
            } else {
              res1.redirect(`http://127.0.0.1:3000/#!/game?profileId=${accountUser._id}`);
            }
          })
      });
    });
  });
});

router.get('/nooauth', (req, res2, next) => {
  console.log(req.query.email)
  let mailboxLayerUrl = `http://apilayer.net/api/check?access_key=${mailboxlayer_apikey}&email=${req.query.email}`;
  request.get(mailboxLayerUrl, (err, resp2, body3) => {
    let eResults = body3.split(',')
    let keyPair = eResults[6]
    let finalKeyPair = keyPair.split(':');

    console.log(JSON.parse(body3))
    console.log(finalKeyPair)

    if(finalKeyPair[1] === 'false') {
      console.log('EMAIL WAS FALSE')
      res.json({data: 'invalid'})
    } else if(finalKeyPair[1] === 'true') {
        console.log('EMAIL WAS TRUE')
        googleAuthUser.findOne( {email: req.query.email}, (err, user) => {
          if(user === null) {
            console.log('CREATING NEW USER')
            let newUser = new googleAuthUser({
              fullName: req.body.email,
              email: req.body.email,
              score: {
                gamesPlayed: 0,
                gamesWon: 0,
                gameRecords: []
              }
            })

            newUser.save();
          }
        }).then( () => {
            googleAuthUser.findOne( {email: req.query.email}, (err, accountUser) => {
              console.log('LOOKING FOR ACCOUNT')
              if(process.env.NODE_ENV === 'production') {
                res2.redirect(`https://thawing-tor-23519.herokuapp.com/#!/game`);
              } else {
                console.log('FOUND ACCOUNT')
                console.log(accountUser._id)
                // res2.statusCode = 302;
                res2.redirect(`http://127.0.0.1:3000/#!/game?profileId=${accountUser._id}`);
              }
            })
        });
    }
  })
});

module.exports = router;
