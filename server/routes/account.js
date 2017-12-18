const express = require('express');
const router = express.Router();
const token = require('../config/token');
const responses = require('./responses');

const account = {
  name: 'John Doe',
  email: 'john@doe',
  role: 'administrator'
};

router.get('/', (req, res) => {
  console.log('account');
  res.status(200).json(account);
});


module.exports = router;