const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({data: 'Members route works'})
});

module.exports = router
