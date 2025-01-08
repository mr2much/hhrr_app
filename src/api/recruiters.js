const express = require('express');
const router = express.Router();

const title = 'AristoCrew';

router.get('/register', (req, res) => {
  res.render('recruiters/register', { title });
});

router.get('/login', (req, res) => {
  res.render('recruiters/login', { title });
});

module.exports = router;
