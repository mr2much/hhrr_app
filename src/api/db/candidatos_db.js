const mongoose = require('mongoose');

const url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/candidatos';

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
    country: { type: String, default: 'República Dominicana' },
    region: { type: String },
    notas: { type: String },
  },
  { collection: 'candidato' }
);

candidatoSchema.virtual('fullName').get(function () {
  return `${this.nombres} ${this.apellidos}`;
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

const Candidato = mongoose.model('Candidato', candidatoSchema);

findAll = () => Candidato.find({});

findOneById = (id) => Candidato.findById(id);

findByIdAndUpdate = (id, newCandidato) =>
  Candidato.findByIdAndUpdate(id, newCandidato, {
    runValidators: true,
    new: true,
  });

insertOne = (newCandidato) => Candidato.create(newCandidato);

module.exports = {
  findAll,
  findOneById,
  findByIdAndUpdate,
  insertOne,
};
