/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
const express = require('express');

const fs = require('fs');
const path = require('path');
const { title } = require('process');
const db = require('./db/candidatos_db');
const perfiles = require('./const/perfiles');
const nivelesAcademicos = require('./const/nivelesAcademicos');
// const monk = require('monk');

// const url = process.env.MONGO_URI || 'localhost:27017/candidatos';

const _dir = '/res/img';

// const db = monk(url);
// const candidatos = db.get('candidato');

// candidatos.createIndex({ cedula: 1 }, { unique: true });

// // Para agregar un Field que no existe a todos los documentos de la DB, quizas probar con $rename?
// // candidatos.bulkWrite([
// //   {
// //     updateMany: {
// //       filter: {},
// //       update: {
// //         $set: { country_region_data: { country: '', selectedRegion: '' } },
// //       },
// //     },
// //   },
// // ]);

const router = express.Router();

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

function imageBase64ToImageFile(imagePath, image) {
  const asciiToBinary = Buffer.from(image.imgTo64, 'base64');

  fs.writeFile(imagePath, asciiToBinary, (err) => {
    if (err) {
      return new Error(
        `There was a problem saving when trying to write ${image.imgName}`
      );
    }
  });
}

function handleImageData(image, id) {
  imageBase64ToImageFile(
    path.join(`public${_dir}/${id}_${image.imgName}`),
    image
  );
}

// // Actualizar un candidato
router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  const newCandidato = req.body;

  newCandidato.imgUrl = `${_dir}/${id}_${newCandidato.image.imgName}`;

  try {
    if (newCandidato.image) {
      handleImageData(newCandidato.image, id);
    }

    const updatedCandidato = await db.findByIdAndUpdate(id, newCandidato);

    if (updatedCandidato) {
      res.status(200).json(updatedCandidato);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

// // Crear un candidato
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

// // Actualizar un candidato
// router.put('/:id', candidatoValidator, (req, res, next) => {
//   const replaceCandidato = getCandidatoFromBody(req.body);

//   candidatos
//     .update({ _id: req.params.id }, { $set: replaceCandidato })
//     .then((updatedCandidato) => {
//       res.status(200);
//       res.json(updatedCandidato);
//     });
// });

// // Remover un candidato
// router.delete('/:id', async (req, res, next) => {
//   candidatos.findOne({ _id: req.params.id }, (err, data) => {
//     if (err) {
//       next(err);
//       return;
//     }

//     if (data) {
//       candidatos.remove({ _id: req.params.id }, {}, (error, numRemoved) => {
//         if (error) {
//           next(err);
//           return;
//         }

//         res.status(200);
//         res.json({ message: `Removed ${numRemoved} entries` });
//       });
//     }
//   });
// });

module.exports = router;
