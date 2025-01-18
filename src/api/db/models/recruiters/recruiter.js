const mongoose = require('../../mongo/db');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const recruiterSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

recruiterSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Recruiter', recruiterSchema);
