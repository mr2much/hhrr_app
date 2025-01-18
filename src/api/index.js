const express = require('express');

const emojis = require('./emojis');
const candidatos = require('./candidatos');
const profiles = require('./profiles');
const departments = require('./departments');
const recruiters = require('./routes/recruiters');

const router = express.Router();

const isRecruiterLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated() && !req.recruiter) {
    req.flash('error', 'Access denied. Recruiters only');
    return res.redirect('/api/v1/recruiters/login');
  }
  next();
};

router.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

router.use('/emojis', emojis);
router.use('/candidatos', isRecruiterLoggedIn, candidatos);
router.use('/profiles', isRecruiterLoggedIn, profiles);
router.use('/departments', isRecruiterLoggedIn, departments);
router.use('/recruiters', recruiters);

module.exports = router;
