/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
const express = require('express');

const _dir = '/res/img';

const db = require('./db/models/candidatos_db');
const perfiles = require('../constants/perfiles');
const nivelesAcademicos = require('../constants/nivelesAcademicos');
const imgUtils = require('../lib/imgUtils');

// const candidatos = db.get('candidato');

const router = express.Router();

// redirect to new form
router.get('/new', (req, res, next) => {
  res.render('candidatos/new', {
    perfiles,
    nivelesAcademicos,
    title: 'New Candidato',
  });
});

// Lee todos los candidatos
router.get('/', async (req, res, next) => {
  const candidatos = await db.findAll();

  res.render('candidatos/home', { candidatos, title: 'HHRR Manager Home' });
});

// Lee un candidato con ID
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  const candidato = await db.findOneById(id);

  res.render('candidatos/details', {
    candidato,
    title: `Detalles de ${candidato.fullName}`,
  });
});

const experiencia = [
  { id: 'inexperienced', value: 'Sin experiencia' },
  { id: 'experienced', value: 'Con experiencia' },
];

// Redirecciona a Edit Form
router.get('/:id/edit', async (req, res, next) => {
  const { id } = req.params;

  const candidato = await db.findOneById(id);
  res.render('candidatos/edit', {
    candidato,
    experiencia,
    perfiles,
    nivelesAcademicos,
    title: `Editar información de ${candidato.fullName}`,
  });
});

// // Actualizar un candidato
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const newCandidato = req.body;

    const updatedCandidato = await db.findByIdAndUpdate(id, newCandidato);

    if (updatedCandidato) {
      res.status(200).json(updatedCandidato);
    }
  } catch (error) {
    next(error);
  }
});

// // Crear un candidato
router.post('/', async (req, res, next) => {
  const candidato = req.body;

  try {
    if (candidato.image) {
      candidato.imgUrl = `${_dir}/${candidato.cedula}_${candidato.image.imgName}`;
      imgUtils.handleImageData(candidato.image, candidato.cedula);
    }

    const newCandidato = await db.insertOne(candidato);

    if (newCandidato) {
      res.status(200).json(newCandidato);
    }
  } catch (error) {
    next(error);
  }
});

// // Remover un candidato
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  const removedCandidato = await db.findByIdAndDelete(id);

  res.redirect('/api/v1/candidatos');
});

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
