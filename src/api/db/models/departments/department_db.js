const Department = require('./department');

findAll = () => Department.find({});

insertOne = (department) => Department.create(department);

findOneById = (id) => Department.findById(id);

module.exports = {
  findAll,
  insertOne,
  findOneById,
};
