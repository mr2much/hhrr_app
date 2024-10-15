const mongoose = require('../../mongo/db');
const Candidato = require('../candidato');
const { firstNames, surnames } = require('../../../../constants/names');
const {
  colors,
  separators,
  categories,
} = require('../../../../constants/companyHelper');
const { geodata } = require('../../../../constants/geojson_chart_data');
const { countryNames } = require('../../../../constants/countrynames');
const perfiles = require('../../../../constants/perfiles');
const nivelesAcademicos = require('../../../../constants/nivelesAcademicos');

function generateRandomID() {
  const firstSegment = String(Math.floor(Math.random() * 1000)).padStart(
    3,
    '0'
  );
  const secondSegment = String(Math.floor(Math.random() * 10000000)).padStart(
    7,
    '0'
  );
  const thirdSegment = String(Math.floor(Math.random() * 10));

  return `${firstSegment}-${secondSegment}-${thirdSegment}`;
}

function generateRandomDOB() {
  const start = new Date(1950, 0, 1); // Start date (January 1, 1950)
  const end = new Date(); // End date (today)

  const randomDate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );

  const day = String(randomDate.getDate()).padStart(2, '0');
  const month = String(randomDate.getMonth() + 1).padStart(2, '0');
  const year = randomDate.getFullYear();

  return `${month}/${day}/${year}`;
}

function getRandomBoolean() {
  return Math.random() < 0.5;
}

function getRandomCompanyName() {
  return `${sample(colors)} ${sample(surnames)}${sample(separators)}${sample(
    surnames
  )} ${sample(categories)}`.trim();
}

function getRandomSalary() {
  return Math.floor(Math.random() * 400000);
}

function getRandomCountryRegion() {
  const { geodatasource_country: countryCode, geodatasource_region: region } =
    sample(geodata);

  const { country } = countryNames.find(
    (country) => country.code === countryCode.toLowerCase()
  );

  return { country, region };
}

sample = (array) => array[Math.floor(Math.random() * array.length)];

async function execute() {
  await Candidato.deleteMany({});

  const candidatos = [];
  for (let i = 0; i < 25; i++) {
    const candidato = {
      cedula: generateRandomID(),
      nombres: sample(firstNames),
      apellidos: sample(surnames),
      dob: generateRandomDOB(),
      candidateExp: getRandomBoolean() ? 'Con experiencia' : 'Sin experiencia',
      currentlyWorking: getRandomBoolean(),
      exp_salario: getRandomSalary(),
      perfilCandidato: sample(perfiles).text,
      nivelAcademico: sample(nivelesAcademicos).text,
      countryRegionData: getRandomCountryRegion(),
    };

    candidato.email = `${candidato.nombres}.${candidato.apellidos}@domain.com`;
    candidato.job_actual = candidato.currentlyWorking
      ? getRandomCompanyName()
      : '';

    candidatos.push(new Candidato(candidato));
  }

  await Candidato.insertMany(candidatos);
  await mongoose.disconnect();
}

execute();
