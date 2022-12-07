const express = require('express');

const emojis = require('./emojis');
const candidatos = require('./candidatos');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);
router.use('/candidatos', candidatos);

module.exports = router;
