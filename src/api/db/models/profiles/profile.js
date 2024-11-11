const mongoose = require('../../mongo/db');
const { Schema } = mongoose;

const profileSchema = new Schema({
  name: {
    type: String,
    required: [true, 'You must provide a profile name'],
  },
  area: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
  },
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
