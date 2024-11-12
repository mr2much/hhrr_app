const express = require('express');
const catchAsyncErrors = require('../lib/catchAsyncErrors');
const db = require('./db/models/profiles/profile_db');
const departmentDB = require('./db/models/departments/department_db');

const router = express.Router();

// List all profiles
router.get(
  '/',
  catchAsyncErrors(async (req, res) => {
    const { department } = req.query;

    if (department) {
      const perfiles = await db.findByDepartment(department).populate('area');
      const { name } = await departmentDB.findOneById(department);

      res.render('perfiles/index', {
        perfiles,
        department: name,
        title: 'Profile Management Home',
      });
    } else {
      const perfiles = await db.findAll().populate('area');

      res.render('perfiles/index', {
        perfiles,
        department: 'All',
        title: 'Profile Management Home',
      });
    }
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

// Edit One Profile
router.get(
  '/:id/edit',
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const profile = await db.findOneById(id).populate('area');
    res.render('perfiles/edit', {
      profile,
      title: `Editar información de ${profile.name}`,
    });
  })
);

// Update One Profile
router.put(
  '/:id',
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { profile } = req.body;

    const updatedProfile = await db.findByIdAndUpdate(id, profile);

    if (updatedProfile) {
      res.redirect(`/api/v1/profiles`);
    }
  })
);

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
