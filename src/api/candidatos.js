/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
const express = require('express');
const monk = require('monk');
const url = process.env.MONGO_URI || 'localhost:27017/candidatos';

const db = monk(url);
const candidatos = db.get('candidato');

candidatos.createIndex({ cedula: 1 }, { unique: true });

// const queries = require('../../db/queries');

// const Datastore = require('nedb');
// const monk = require('monk');
// const Joi = require('@hapi/joi');

// const db = new Datastore({ autoload: true, filename: process.env.NEDB_URI });

// db.ensureIndex({ fieldName: 'cedula', unique: true }, (err) => {
//   if (err) throw err;
// });

// db.loadDatabase();

// const schema = Joi.object({
//   cedula: Joi.string().trim().required(),
//   nombre: Joi.string().trim().required(),
//   apellidos: Joi.string().trim().required(),
//   dob: Joi.date().required(),
//   job_actual: Joi.string().trim(),
//   exp_salario: Joi.number().integer(),
// });

const router = express.Router();

// Lee todos los candidatos
router.get('/', async (req, res, next) => {
  candidatos.find().then((candidates) => {
    res.status(200);
    res.json(candidates);
  });
});

// Lee un candidato con ID
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  candidatos.findOne({ _id: id }).then((candidato) => {
    res.status(200);
    res.json(candidato);
  });
});

function validaCedula(cedula) {
  return (
    typeof cedula === 'string' &&
    cedula.trim() !== '' &&
    cedula.length === 13 &&
    cedula.match('^[0-9]{3}-?[0-9]{7}-?[0-9]{1}$') !== null
  );
}

function validCandidato(candidato) {
  return (
    typeof candidato.nombres === 'string' &&
    typeof candidato.apellidos === 'string' &&
    validaCedula(candidato.cedula) &&
    typeof candidato.dob === 'string' &&
    candidato.dob.match('^[0-9]{4}-?[0-9]{2}-?[0-9]{2}$') &&
    !Number.isNaN(candidato.exp_salario)
  );
}

// Middleware that sends the appropriate response if the Candidato is valid
function candidatoValidator(req, res, next) {
  if (validCandidato(req.body)) {
    next();
  } else {
    const error = new Error(`Candidato invalido! ${JSON.stringify(candidato)}`);
    next(error);
  }
}

function getCandidatoFromBody(body) {
  const { cedula, nombres, apellidos, dob, job_actual, exp_salario } = body;

  const candidato = {
    cedula,
    nombres,
    apellidos,
    dob,
    job_actual,
    exp_salario,
  };

  return candidato;
}

// Crear un candidato
router.post('/', candidatoValidator, (req, res, next) => {
  const candidato = getCandidatoFromBody(req.body);

  if (candidato) {
    candidatos
      .insert(candidato)
      .then((createdCandidato) => {
        console.log('Error');
        res.status(200);
        res.json(createdCandidato);
      })
      .catch((err) => {
        next(err);
      });
  } else {
    const error = new Error(`Error when inserting candidato: ${candidato}`);
    next(error);
  }
});

// Actualizar un candidato
router.put('/:id', candidatoValidator, (req, res, next) => {
  const replaceCandidato = getCandidatoFromBody(req.body);

  candidatos
    .update({ _id: req.params.id }, { $set: replaceCandidato })
    .then((updatedCandidato) => {
      res.status(200);
      res.json(updatedCandidato);
    });
});

// Remover un candidato
router.delete('/:id', async (req, res, next) => {
  candidatos.findOne({ _id: req.params.id }, (err, data) => {
    if (err) {
      next(err);
      return;
    }

    if (data) {
      candidatos.remove({ _id: req.params.id }, {}, (error, numRemoved) => {
        if (error) {
          next(err);
          return;
        }

        res.status(200);
        res.json({ message: `Removed ${numRemoved} entries` });
      });
    }
  });
});

module.exports = router;
