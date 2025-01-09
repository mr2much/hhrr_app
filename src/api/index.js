const express = require('express');

const emojis = require('./emojis');
const candidatos = require('./candidatos');
const profiles = require('./profiles');
const departments = require('./departments');
const recruiters = require('./routes/recruiters');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

router.use('/emojis', emojis);
router.use('/candidatos', candidatos);
router.use('/profiles', profiles);
router.use('/departments', departments);
router.use('/recruiters', recruiters);

module.exports = router;
