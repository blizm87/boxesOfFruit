const express = require('express');
const router = express.Router();
const request = require('request');
const googleAuthUser = require('../models/authenticatedUsers.js');

const mailboxlayer_apikey = process.env.MAILBOXLAYER_APIKEY;

// GOOGLE AUTHENTICATION
router.get('/google', (req, res, next) => {
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const client_secret = process.env.GOOGLE_CLIENT_SECRET;
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
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const client_secret = process.env.GOOGLE_CLIENT_SECRET;
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
              res1.redirect(`https://thawing-tor-23519.herokuapp.com/#!/game?profileId=${accountUser._id}`);
            } else {
              res1.redirect(`http://127.0.0.1:3000/#!/game?profileId=${accountUser._id}`);
            }
          })
      });
    });
  });
});

// LINKEDIN AUTHENTICATION
router.get('/linkedin', (req, res, next) => {
  const client_id = process.env.LINKEDIN_CLIENT_ID;
  const client_secret = process.env.LINKEDIN_CLIENT_SECRET;
  if(process.env.NODE_ENV === 'production') {
    var redirect_uri = 'https://thawing-tor-23519.herokuapp.com/auth/linkedin/callback';
  } else {
    var redirect_uri = 'http://127.0.0.1:3000/auth/google/callback';
  }

  const url = 'https://www.linkedin.com/oauth/v2/authorization';
  const queryParams = `response_type=code&client_id=${client_id}&scope=r_emailaddress&state=abc&redirect_uri=${redirect_uri}`;
  res.redirect(url + '?' + queryParams);
});

router.get('/linkedin/callback', (req, res1, next) => {
  const client_id = process.env.LINKEDIN_CLIENT_ID;
  const client_secret = process.env.LINKEDIN_CLIENT_SECRET;
  if(process.env.NODE_ENV === 'production') {
    var redirect_uri = 'https://thawing-tor-23519.herokuapp.com/auth/linkedin/callback'
  } else {
    var redirect_uri = 'http://127.0.0.1:3000/auth/linkedin/callback';
  }
  const {code, state} = req.query;
  let url = 'https://www.linkedin.com/oauth/v2/accessToken';
  const form = {
    code,
    client_id,
    client_secret,
    redirect_uri,
    grant_type: 'authorization_code',
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    }
  }
  request.post(url, {form}, (err, resp, body) => {
    console.log('I GET AN ACCESS TOKEN HERE')
    console.log(body)
    const data = JSON.parse(body);
    url = 'https://api.linkedin.com/v1/people/~?format=json';
    const access_token = data.access_token;
    const options = {
      method: 'GET',
      url,
      Connection: 'Keep-Alive',
      'Authorization' : `Bearer ${access_token}`,
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        'x-li-format': 'json'
      }
    }
    request(options, (err, response, body2) => {
      console.log('I RETRIEVE DATA HERE')
      // const userInfo = JSON.parse(body2);
      // console.log('I AM THE USERINFO: ');
      // console.log(err)
      // console.log(response)
      console.log(body2)

      res1.redirect('https://thawing-tor-23519.herokuapp.com/#!/game')
      // googleAuthUser.findOne( {email: userInfo.emails[0].value}, (err, user) => {
      //   if(user === null) {
      //     let newUser = new googleAuthUser({
      //       fullName: userInfo.displayName,
      //       email: userInfo.emails[0].value,
      //       score: {
      //         gamesPlayed: 0,
      //         gamesWon: 0,
      //         gameRecords: []
      //       }
      //     })

      //     newUser.save();
      //   }
      // }).then( () => {
      //     googleAuthUser.findOne( {email: userInfo.emails[0].value}, (err, accountUser) => {
      //       if(process.env.NODE_ENV === 'production') {
      //         res1.redirect(`https://thawing-tor-23519.herokuapp.com/#!/game?profileId=${accountUser._id}`);
      //       } else {
      //         res1.redirect(`http://127.0.0.1:3000/#!/game?profileId=${accountUser._id}`);
      //       }
      //     })
      // });
    });
  });
});

// NO AUTHENTICATION - JUST EMAIL
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
                res2.json({data: accountUser._id})
                // res2.redirect(`https://thawing-tor-23519.herokuapp.com/#!/game?profileId=${accountUser._id}`);
              } else {
                console.log('FOUND ACCOUNT')
                console.log(accountUser._id)
                res2.json({data: accountUser._id})
                // res2.redirect(`http://127.0.0.1:3000/#!/game?profileId=${accountUser._id}`);
              }
            })
        });
    }
  })
});

module.exports = router;
