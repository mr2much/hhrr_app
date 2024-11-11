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

// Lee todos los candidatos
router.get(
  '/',
  catchAsyncErrors(async (req, res, next) => {
    const candidatos = await db.findAll();

    res.render('candidatos/home', {
      candidatos,
      title: 'Candidate Managemenet Home',
    });
  })
);

// Lee un candidato con ID
router.get(
  '/:id',
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const candidato = await db.findOneById(id).populate('candidateProfile');

    res.render('candidatos/details', {
      candidato,
      title: `Detalles de ${candidato.fullName}`,
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

// // Actualizar un candidato
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
