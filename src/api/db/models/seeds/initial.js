const mongoose = require('../../mongo/db');
const Candidato = require('../candidato');
const candidatos = require('../../../../constants/candidatos');

async function execute() {
  await Candidato.deleteMany({});
  await Candidato.insertMany(candidatos);
  await mongoose.disconnect();
}

execute();
