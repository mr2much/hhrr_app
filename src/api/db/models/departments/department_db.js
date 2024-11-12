const Department = require('./department');

findAll = () => Department.find({});

insertOne = (department) => Department.create(department);

findOneById = (id) => Department.findById(id);

findByIdAndUpdate = (id, department) =>
  Department.findByIdAndUpdate(id, department, {
    runValidators: true,
    new: true,
  });

module.exports = {
  findAll,
  insertOne,
  findOneById,
  findByIdAndUpdate,
};
