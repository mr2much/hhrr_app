const mongoose = require('mongoose');
const dataUtils = require('../../../lib/dataUtils');
const imgUtils = require('../../../lib/imgUtils');

const url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/candidatos';
const _dir = '/res/img';

mongoose
  .connect(url)
  .then(() => {
    console.log(`Connected to ${url}`);
  })
  .catch((err) => {
    console.log(`There was an error connecting to ${url}`);
    console.log(err);
  });

const candidatoSchema = new mongoose.Schema(
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
    perfilCandidato: { type: String },
    imgUrl: { type: String, default: '/res/img/user.png' },
    nivelAcademico: { type: String },
    countryRegionData: {
      country: { type: String, default: 'Dominican Republic' },
      selectedIndex: { type: Number, default: 62 },
      region: { type: String, default: 'Distrito Nacional (Santo Domingo)' },
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

  next();
});
candidatoSchema.pre('findOneAndUpdate', async function (next) {
  this._update.age = dataUtils.calculateAgeFromDOB(this._update.dob);

  next();
});

candidatoSchema.post('findOneAndDelete', async (doc, next) => {
  try {
    imgUtils.deleteImageFile(doc.imgUrl);
    next();
  } catch (error) {
    next(error);
  }
});

const Candidato = mongoose.model('Candidato', candidatoSchema);

findAll = () => Candidato.find({});

findOneById = (id) => Candidato.findById(id);

findByIdAndUpdate = (id, newCandidato) => {
  try {
    if (newCandidato.image) {
      imgUtils.replaceImageFile(newCandidato.image, newCandidato.cedula);
      newCandidato.imgUrl = `${_dir}/${newCandidato.cedula}_${newCandidato.image.imgName}`;
    }

    return Candidato.findByIdAndUpdate(id, newCandidato, {
      runValidators: true,
      new: true,
    });
  } catch (error) {
    throw new Error(error);
  }
};

insertOne = (newCandidato) => Candidato.create(newCandidato);

findByIdAndDelete = (id) => Candidato.findByIdAndDelete(id);

module.exports = {
  findAll,
  findOneById,
  findByIdAndUpdate,
  insertOne,
  findByIdAndDelete,
};
