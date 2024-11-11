const express = require('express');
const catchAsyncErrors = require('../lib/catchAsyncErrors');
const db = require('./db/models/profiles/profile_db');

const router = express.Router();

// List all profiles
router.get(
  '/',
  catchAsyncErrors(async (req, res) => {
    const perfiles = await db.findAll();

    res.render('perfiles/index', {
      perfiles,
      title: 'Profile Management Home',
    });
  })
);

// Show One Profile
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const profile = await db.findOneById(id).populate('area');

  if (profile) {
    res.render('perfiles/show', {
      profile,
      title: `Detalles de ${profile.name}`,
    });
  }
});

// Create a new Profile
router.post(
  '/',
  catchAsyncErrors(async (req, res) => {
    const { profile } = req.body;

    const perfil = await db.insertOne(profile);

    if (perfil) {
      res.redirect(`/api/v1/profiles/${perfil._id}`);
    }
  })
);

module.exports = router;
