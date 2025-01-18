const express = require('express');
const Recruiter = require('../db/models/recruiters/recruiter');
const router = express.Router();
const passport = require('passport');

const title = 'AristoCrew';

router.get('/register', (req, res) => {
  res.render('recruiters/register', { title });
});

router.post('/register', async (req, res) => {
  try {
    const { recruiter } = req.body;
    const { email, username, password } = recruiter;

    const newRecruiter = new Recruiter({ email, username });
    const registeredRecruiter = await Recruiter.register(
      newRecruiter,
      password
    );

    req.login(registeredRecruiter, (err) => {
      if (err) {
        return next(err);
      }

      req.flash('success', 'Welcome to AristoCrew');
      res.redirect('/api/v1/candidatos/');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/api/v1/recruiters/login');
  }
});

router.get('/login', (req, res) => {
  res.render('recruiters/login', { title });
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/api/v1/recruiters/login',
  }),
  (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/api/v1/candidatos/');
  }
);

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.flash('success', 'Goodbye!');
    res.redirect('/api/v1/');
  });
});

module.exports = router;
