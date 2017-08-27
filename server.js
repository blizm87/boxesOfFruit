require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');

const app = express();

// CONFIG
// require('./src/db/config.js');
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './public')));
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES
app.use('/auth', require('./src/routes/auth.js'));
app.use('/members', require('./src/routes/members.js'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Boxes of Fruit is Listening');
})
