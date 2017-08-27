const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

router.get('/', (req, res, next) => {
  res.json({data: 'Members route works'})
});

module.exports = router
