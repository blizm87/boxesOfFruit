const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({data: 'Auth route works'})
});

module.exports = router
