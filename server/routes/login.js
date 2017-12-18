const express = require('express');
const router = express.Router();
const token = require('../config/token');
const responses = require('./responses');

router.post('/', (req, res) => {
  console.log('login');
  if (!req.body.username || !req.body.password) {
    res.status(500).json(responses.BAD_REQUEST);
  } else {
    res.status(200).json({ token });
  }
});


module.exports = router;