const Profile = require('./profile');

findAll = () => Profile.find({});

findByDepartment = (department) => Profile.where('area').in([department]);

insertOne = (profile) => Profile.create(profile);

findOneById = (id) => Profile.findById(id);

findByIdAndUpdate = (id, profile) =>
  Profile.findByIdAndUpdate(id, profile, {
    runValidators: true,
    new: true,
  });

module.exports = {
  findAll,
  findByDepartment,
  insertOne,
  findOneById,
  findByIdAndUpdate,
};
