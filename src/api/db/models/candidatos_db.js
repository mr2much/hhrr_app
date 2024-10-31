const Candidato = require('./candidato');
const imgUtils = require('../../../lib/imgUtils');

const _dir = '/res/img';

findAll = () => Candidato.find({});

findOneById = (id) => Candidato.findById(id);

findByIdAndUpdate = (id, oldImgUrl, newCandidato) => {
  try {
    if (oldImgUrl && oldImgUrl !== 'user.png') {
      imgUtils.replaceImageFile(oldImgUrl);
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
