const express = require('express');
const catchAsyncErrors = require('../lib/catchAsyncErrors');
const db = require('./db/models/departments/department_db');
const Profile = require('./db/models/profiles/profile_db');
const AppError = require('../lib/AppError');

const router = express.Router();

// List all Departments
router.get(
  '/',
  catchAsyncErrors(async (req, res) => {
    const departments = await db.findAll();
    res.render('departments/index', {
      departments,
      title: 'Department Management Home',
    });
  })
);

// Redirect to new Department form
router.get('/new', (req, res) => {
  res.render('departments/new', {
    title: 'New Department',
  });
});

// List one by id
router.get(
  '/:id',
  catchAsyncErrors(async (req, res) => {
    const { id } = req.params;

    const department = await db.findOneById(id).populate('profiles');

    if (department) {
      res.render('departments/show', {
        department,
        title: `Detalles de ${department.name}`,
      });
    }
  })
);

// Create new Department
router.post(
  '/',
  catchAsyncErrors(async (req, res) => {
    const { department } = req.body;

    const departamento = await db.insertOne(department);

    if (departamento) {
      res.redirect(`/api/v1/departments/${departamento._id}`);
    }
  })
);

router.get(
  '/:id/profiles/new',
  catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const department = await db.findOneById(id);
    res.render('perfiles/new', { department, title: 'New Profile' });
  })
);

router.post(
  '/:id/profiles',
  catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const { profile } = req.body;
    const department = await db.findOneById(id);
    if (!department) {
      throw new AppError(404, `Department with ID ${id} not found`);
    }

    const profileExists = department.profiles.some((existingProfile) => {
      existingProfile.toString() === profile._id ||
        existingProfile.name === profile.name;
    });

    if (profileExists) {
      throw new AppError(
        400,
        `Profile ${profile.name} already exists in department ${department.name}`
      );
    }

    const perfil = await Profile.insertOne({ ...profile, area: department });
    department.profiles.push(perfil);

    await department.save();

    res.redirect(`/api/v1/departments/${department._id}`);
  })
);

module.exports = router;
