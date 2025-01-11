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
    res.redirect('/api/v1/recruiter/login');
  }
});

router.get('/login', (req, res) => {
  res.render('recruiters/login', { title });
});

module.exports = router;
