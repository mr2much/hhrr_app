const express = require('express');

const emojis = require('./emojis');
const candidatos = require('./candidatos');
const profiles = require('./profiles');
const departments = require('./departments');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);
router.use('/candidatos', candidatos);
router.use('/profiles', profiles);
router.use('/departments', departments);

module.exports = router;
