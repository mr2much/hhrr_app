const mongoose = require('../../mongo/db');
const { Schema } = mongoose;

const departmentSchema = new Schema({
  name: {
    type: String,
    required: [true, 'You must provide a department name'],
  },
  email: {
    type: String,
    require: [true, 'Department must have an email address'],
  },
  profiles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
    },
  ],
});

module.exports = mongoose.model('Department', departmentSchema);
