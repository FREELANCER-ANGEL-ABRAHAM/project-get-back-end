const mongoose = require('mongoose');
const config = require('./config');

function connect() {
  mongoose.connect(
    config.DB_WITH_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function(err, doc) {
      if(!err){
        console.log('Connected to database');
      } else{
        console.error('An error ocurred while connecting to database');
        process.exit(1);
      }
    },
  );
  return mongoose.connection;
}

module.exports = { connect};
