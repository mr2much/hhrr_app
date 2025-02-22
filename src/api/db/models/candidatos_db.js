const Candidato = require('./candidato');
const imgUtils = require('../../../lib/imgUtils');

const _dir = '/res/img';

count = (query) => Candidato.countDocuments(query);
findOne = (query) => Candidato.findOne(query);
findAll = (query) => Candidato.find(query);

findOneById = (id) => Candidato.findById(id);

findByIdAndUpdate = (id, oldImgUrl, newCandidato) => {
  try {
    if (newCandidato.imgUrl) {
      if (oldImgUrl && oldImgUrl !== 'user.png') {
        imgUtils.replaceImageFile(oldImgUrl);
      }
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
  count,
  findOne,
  findAll,
  findOneById,
  findByIdAndUpdate,
  insertOne,
  findByIdAndDelete,
};
