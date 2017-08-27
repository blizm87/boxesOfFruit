const mongoose = require('mongoose');
mongoose.Promise = Promise;
const url = process.env.MONGODB_URI || 'mongodb://localhost/stykuDb';

mongoose.connect(url, { useMongoClient: true })
mongoose.connection.once('open', function () {
  console.log(`Mongoose connected to: ${url}`)
})

module.exports = mongoose
