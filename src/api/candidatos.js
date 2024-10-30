const express = require('express');

const _dir = '/res/img';

const db = require('./db/models/candidatos_db');
const perfiles = require('../constants/perfiles');
const nivelesAcademicos = require('../constants/nivelesAcademicos');
const imgUtils = require('../lib/imgUtils');
const geoJsonUtils = require('../lib/geoUtils');
const AppError = require('../lib/AppError');
const Joi = require('joi');

const router = express.Router();

const experiencia = [
  { id: 'experienced', value: 'Con experiencia' },
  { id: 'inexperienced', value: 'Sin experiencia' },
];

const candidatoValidationSchema = Joi.object({
  candidato: Joi.object({
    cedula: Joi.string().required(),
    nombres: Joi.string().required(),
    apellidos: Joi.string().required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      .required(),
    dob: Joi.date().required(),
    perfilCandidato: Joi.string().required(),
    nivelAcademico: Joi.string().required(),
    countryRegionData: Joi.object({
      country: Joi.string().required(),
      region: Joi.string().required(),
    }).required(),
  })
    .required()
    .options({ allowUnknown: true }),
});

const validateCandidato = (req, res, next) => {
  const { error } = candidatoValidationSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(', ');

    console.log(msg);

    throw new AppError(400, msg);
  } else {
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

const catchAsyncErrors = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

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
  validateCandidato,
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { candidato } = req.body;

    const updatedCandidato = await db.findByIdAndUpdate(id, candidato);

    if (updatedCandidato) {
      res.status(200).json({
        message: 'Redirect',
        redirectURL: `/api/v1/candidatos/${updatedCandidato._id}`,
      });
      // res.status(200).json(updatedCandidato);
    }
  })
);

// // Crear un candidato
router.post(
  '/',
  validateCandidato,
  catchAsyncErrors(async (req, res, next) => {
    const { candidato } = req.body;

    if (candidato.image) {
      candidato.imgUrl = `${_dir}/${candidato.cedula}_${candidato.image.imgName}`;
      imgUtils.handleImageData(candidato.image, candidato.cedula);
    }

    const newCandidato = await db.insertOne(candidato);

    if (newCandidato) {
      // res.redirect(`/api/v1/candidatos/${newCandidato._id}`);
      res.status(200).json({
        message: 'Redirect',
        redirectURL: `/api/v1/candidatos/${newCandidato._id}`,
      });
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
