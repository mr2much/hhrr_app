const Profile = require('./profile');

findAll = () => Profile.find({});

findByDepartment = (department) => Profile.where('area').in([department]);

insertOne = (profile) => Profile.create(profile);

findOneById = (id) => Profile.findById(id);

module.exports = {
  findAll,
  findByDepartment,
  insertOne,
  findOneById,
};
