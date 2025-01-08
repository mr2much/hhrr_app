const express = require('express');
const multer = require('multer');

const _dir = '/res/img';

const db = require('./db/models/candidatos_db');
const { candidatoValidationSchema } = require('./joi/joi-schemas');
const profileDB = require('./db/models/profiles/profile_db');
const perfiles = require('../constants/perfiles');
const nivelesAcademicos = require('../constants/nivelesAcademicos');
const experiencia = require('../constants/experiencia');
// const imgUtils = require('../lib/imgUtils');
const geoJsonUtils = require('../lib/geoUtils');
const AppError = require('../lib/AppError');
const catchAsyncErrors = require('../lib/catchAsyncErrors');
const paginateResults = require('../lib/paginateResults');
const Department = require('./components/Department');

const router = express.Router();

const upload = multer({ dest: 'public/res/img' });

const validateCandidato = (req, res, next) => {
  const { error } = candidatoValidationSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(', ');

    throw new AppError(400, msg);
  } else {
    req.body.candidato.currentlyWorking = req.body.candidato.currentlyWorking
      ? true
      : false;

    next();
  }
};

// redirect to new form
router.get(
  '/new',
  catchAsyncErrors(async (req, res, next) => {
    const profiles = await profileDB.findAll();
    res.render('candidatos/new', {
      experiencia,
      profiles,
      perfiles,
      nivelesAcademicos,
      title: 'New Candidato',
    });
  })
);

// redirect to map
router.get('/map', (req, res, next) => {
  res.render('candidatos/map', { title: 'Candidatos en el Mundo' });
});

router.get(
  '/all',
  catchAsyncErrors(async (req, res, next) => {
    const candidatos = await db.findAll();

    const geojsonData = geoJsonUtils.buildGeoJSONFromCandidatos(candidatos);

    res.json(geojsonData);
  })
);

const paginate = (Model, collection) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || '';
    let sort = req.query.sort || 'age';
    let profile = req.query.profile || 'All';

    // Converts profile to Array if it isn't one
    profile = Array.isArray(profile) ? profile : [profile];

    // Joins all values into a single string, then splits it
    // when profile receives comma-separated strings
    profile = profile.join(',').split(',');

    query = profile.includes('All')
      ? {}
      : { candidateProfile: { $in: profile } };

    const docs = await Model.findAll(query)
      .populate(collection)
      .skip(page * limit)
      .limit(limit);

    const total = await Model.count(query);

    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      profile,
      docs,
    };

    res.response = response;

    next();
  };
};

// Lee todos los candidatos
router.get(
  '/',
  paginate(db, {
    path: 'candidateProfile',
    populate: { path: 'area', model: 'Department' },
  }),
  catchAsyncErrors(async (req, res, next) => {
    const { profile } = req.query;

    // const filters = departments
    //   ? {
    //       department: {
    //         $in: Array.isArray(departments) ? departments : [departments],
    //       },
    //     }
    //   : [];
    // const candidatos = await db.findAll().populate({
    //   path: 'candidateProfile',
    //   populate: { path: 'area', model: 'Department' },
    // });

    const filterElement = await Department(profile);

    res.render('candidatos/index', {
      response: res.response,
      filterElement,
      title: 'Candidate Managemenet Home',
    });
  })
);

// Lee un candidato con ID
router.get(
  '/:id',
  paginateResults(db, 'candidateProfile'),
  catchAsyncErrors(async (req, res, next) => {
    res.render('candidatos/details', {
      docs: res.docs,
      title: `Detalles de ${res.docs.document.fullName}`,
    });
  })
);

// Redirecciona a Edit Form
router.get(
  '/:id/edit',
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const profiles = await profileDB.findAll();

    const candidato = await db.findOneById(id).populate('candidateProfile');
    res.render('candidatos/edit', {
      candidato,
      experiencia,
      profiles,
      perfiles,
      nivelesAcademicos,
      title: `Editar información de ${candidato.fullName}`,
    });
  })
);

// Actualizar un candidato
router.patch(
  '/:id',
  upload.single('candidato[imgUrl]'),
  validateCandidato,
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { candidato } = req.body;

    const oldCandidato = await db.findOneById(id);

    const oldImgUrl = oldCandidato.imgUrl.split('/')[3];

    if (req.file) {
      candidato.imgUrl = `${_dir}/${req.file.filename}`;
    }

    const updatedCandidato = await db.findByIdAndUpdate(
      id,
      oldImgUrl,
      candidato
    );

    if (updatedCandidato) {
      res.redirect(`/api/v1/candidatos/${updatedCandidato._id}`);
    }
  })
);

// // Crear un candidato
router.post(
  '/',
  upload.single('candidato[imgUrl]'),
  validateCandidato,
  catchAsyncErrors(async (req, res, next) => {
    const { candidato } = req.body;

    if (req.file) {
      candidato.imgUrl = `${_dir}/${req.file.filename}`;
    }

    const newCandidato = await db.insertOne(candidato);

    if (newCandidato) {
      res.redirect(`/api/v1/candidatos/${newCandidato._id}`);
    }
  })
);

// // Remover un candidato
router.delete(
  '/:id',
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const removedCandidato = await db.findByIdAndDelete(id);

    res.redirect('/api/v1/candidatos');
  })
);

// function validaCedula(cedula) {
//   return (
//     typeof cedula === 'string' &&
//     cedula.trim() !== '' &&
//     cedula.length === 13 &&
//     cedula.match('^[0-9]{3}-?[0-9]{7}-?[0-9]{1}$') !== null
//   );
// }

// function imageBase64ToImageFile(imagePath, image) {
//   const asciiToBinary = Buffer.from(image.imgTo64, 'base64');

//   fs.writeFile(imagePath, asciiToBinary, (err) => {
//     if (err) {
//       return new Error(
//         `There was a problem saving when trying to write ${image.imgName}`
//       );
//     }
//   });
// }

// function handleImageData(image) {
//   imageBase64ToImageFile(path.join(`public/${_dir}/${image.imgName}`), image);

//   return `${_dir}/${image.imgName}`;
// }

module.exports = router;
