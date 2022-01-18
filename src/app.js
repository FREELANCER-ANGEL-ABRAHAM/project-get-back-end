const config = require('./config');
const express = require('express');
const database = require('./database');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
database.connect();


app.get('/', cors(), (req, res) => {
  res.json({message:'Pablo-Web'});
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.status_code || 500).json({
    error: {...err, message: err.message, stack: err.stack},
  }); 
});

app.listen(config.PORT, () =>
  console.log(`Server listening on port ${config.PORT}`),
);