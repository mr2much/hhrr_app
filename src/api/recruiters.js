const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('recruiters/register', { title: 'AristoCrew' });
});

module.exports = router;
