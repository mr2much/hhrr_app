const mongoose = require('../mongo/db');
const { Schema } = mongoose;
const dataUtils = require('../../../lib/dataUtils');
const geoUtils = require('../../../lib/geoUtils');
const imgUtils = require('../../../lib/imgUtils');
const nivelesAcademicos = require('../../../constants/nivelesAcademicos');

const candidatoSchema = new Schema(
  {
    cedula: {
      type: String,
      require: true,
    },
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true },
    dob: { type: Date, required: true },
    age: { type: Number, default: 0 },
    candidateExp: { type: String, default: 'Sin experiencia' },
    currentlyWorking: { type: Boolean, default: false },
    job_actual: { type: String },
    exp_salario: { type: Number, default: 0 },
    candidateProfile: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Profile',
    },

    imgUrl: { type: String, default: '/res/img/user.png' },
    nivelAcademico: { type: String, required: true, enum: nivelesAcademicos },
    countryRegionData: {
      country: { type: String, default: 'Dominican Republic' },
      region: { type: String, default: 'Distrito Nacional (Santo Domingo)' },
      latLon: { type: [Number], default: [18.4801972, -69.942111] },
    },
    notas: { type: String },
  },
  { collection: 'candidato' }
);

candidatoSchema.virtual('fullName').get(function () {
  return `${this.nombres} ${this.apellidos}`;
});

candidatoSchema.virtual('country').get(function () {
  return `${this.countryRegionData.country}`;
});

candidatoSchema.virtual('region').get(function () {
  return `${this.countryRegionData.region}`;
});

candidatoSchema.virtual('localDate').get(function () {
  // Add exactly four hours to stored date
  const newDate = new Date(this.dob.getTime() + 4 * 60 * 60 * 1000);
  return newDate.toLocaleDateString('es-DO');
});

candidatoSchema.virtual('salaryDOP').get(function () {
  return Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
  }).format(this.exp_salario);
});

candidatoSchema.pre('save', async function (next) {
  this.age = dataUtils.calculateAgeFromDOB(this.dob);

  const latLon = await geoUtils.getCoordinatesFromCountryAndRegion(
    this.countryRegionData
  );

  this.countryRegionData.latLon = latLon;

  next();
});

candidatoSchema.pre('insertMany', async (next, docs) => {
  docs.forEach(async (doc) => {
    doc.age = dataUtils.calculateAgeFromDOB(doc.dob);

    const latLon = await geoUtils.getCoordinatesFromCountryAndRegion(
      doc.countryRegionData
    );
    doc.countryRegionData.latLon = latLon;
  });
  next();
});

candidatoSchema.pre('findOneAndUpdate', async function (next) {
  this._update.age = dataUtils.calculateAgeFromDOB(this._update.dob);

  const latLon = await geoUtils.getCoordinatesFromCountryAndRegion(
    this._update.countryRegionData
  );

  this._update.countryRegionData.latLon = latLon;

  next();
});

candidatoSchema.post('findOneAndDelete', async (doc, next) => {
  try {
    if (doc.imgUrl !== '/res/img/user.png') {
      imgUtils.deleteImageFile(doc.imgUrl);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Candidato = mongoose.model('Candidato', candidatoSchema);

module.exports = Candidato;
