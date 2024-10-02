const Candidato = require('./candidato');
const imgUtils = require('../../../lib/imgUtils');

const _dir = '/res/img';

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
