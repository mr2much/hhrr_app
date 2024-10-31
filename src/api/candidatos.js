const express = require('express');
const multer = require('multer');

const _dir = '/res/img';

const db = require('./db/models/candidatos_db');
const { candidatoValidationSchema } = require('./joi/joi-schemas');
const perfiles = require('../constants/perfiles');
const nivelesAcademicos = require('../constants/nivelesAcademicos');
const experiencia = require('../constants/experiencia');
const imgUtils = require('../lib/imgUtils');
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
router.get('/new', (req, res, next) => {
  res.render('candidatos/new', {
    experiencia,
    perfiles,
    nivelesAcademicos,
    title: 'New Candidato',
  });
});

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

    res.render('candidatos/home', { candidatos, title: 'HHRR Manager Home' });
  })
);

// Lee un candidato con ID
router.get(
  '/:id',
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const candidato = await db.findOneById(id);

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

    const candidato = await db.findOneById(id);
    res.render('candidatos/edit', {
      candidato,
      experiencia,
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

// router.post('/', candidatoValidator, (req, res, next) => {
//   const candidato = getCandidatoFromBody(req.body);

//   if (candidato) {
//     candidatos
//       .insert(candidato)
//       .then((createdCandidato) => {
//         res.status(200);
//         res.json(createdCandidato);
//       })
//       .catch(async (err) => {
//         const idxs = await candidatos.indexes();
//         console.log(idxs);
//         next(err);
//       });
//   } else {
//     const error = new Error(`Error when inserting candidato: ${candidato}`);
//     next(error);
//   }
// });

// function validaCedula(cedula) {
//   return (
//     typeof cedula === 'string' &&
//     cedula.trim() !== '' &&
//     cedula.length === 13 &&
//     cedula.match('^[0-9]{3}-?[0-9]{7}-?[0-9]{1}$') !== null
//   );
// }

// function validCandidato(candidato) {
//   return (
//     typeof candidato.nombres === 'string' &&
//     typeof candidato.apellidos === 'string' &&
//     validaCedula(candidato.cedula) &&
//     typeof candidato.dob === 'string' &&
//     candidato.dob.match('^[0-9]{4}-?[0-9]{2}-?[0-9]{2}$') &&
//     !Number.isNaN(candidato.exp_salario)
//   );
// }

// // Middleware that sends the appropriate response if the Candidato is valid
// function candidatoValidator(req, res, next) {
//   if (validCandidato(req.body)) {
//     next();
//   } else {
//     const error = new Error(`Candidato invalido! ${JSON.stringify(candidato)}`);
//     next(error);
//   }
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

// function getCandidatoFromBody(body) {
//   const {
//     cedula,
//     nombres,
//     apellidos,
//     email,
//     dob,
//     age,
//     candidateExp,
//     currentlyWorking,
//     job_actual,
//     exp_salario,
//     perfilCandidato,
//     image,
//     nivelAcademico,
//     country,
//     region,
//     notas,
//   } = body;

//   let { imgUrl } = body;

//   if (image) {
//     imgUrl = handleImageData(image);
//   }

//   const candidato = {
//     cedula,
//     nombres,
//     apellidos,
//     email,
//     dob,
//     age,
//     candidateExp,
//     currentlyWorking,
//     job_actual,
//     exp_salario,
//     perfilCandidato,
//     imgUrl,
//     nivelAcademico,
//     country,
//     region,
//     notas,
//   };

//   return candidato;
// }

module.exports = router;
