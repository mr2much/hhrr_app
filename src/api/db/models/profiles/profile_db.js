const Profile = require('./profile');

findAll = () => Profile.find({});

insertOne = (profile) => Profile.create(profile);

findOneById = (id) => Profile.findById(id);

module.exports = {
  findAll,
  insertOne,
  findOneById,
};
