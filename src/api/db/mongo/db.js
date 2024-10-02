const mongoose = require('mongoose');

const url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/candidatos';

mongoose
  .connect(url)
  .then(() => {
    console.log(`Connected to ${url}`);
  })
  .catch((err) => {
    console.log(`There was an error connecting to ${url}`);
    console.log(err);
  });

module.exports = mongoose;
