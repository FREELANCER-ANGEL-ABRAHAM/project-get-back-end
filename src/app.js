const config = require('./config');
const express = require('express');
const database = require('./database');
const cors = require('cors');
const expressjwt = require('express-jwt');

const UserController = require('./controllers/Usercontroller');
const RefreshTokenController = require('./controllers/RefreshTokenController');
const Tokens = require('./models/Token');

const app = express();

app.use(express.json());
app.use(cors());
database.connect();

const isRevokedCallback = async function (req, payload, done) {
  const tokenInHeader = req.headers.authorization.split(' ')[1];

  const token = await Tokens.findOne({ accessToken: tokenInHeader });

  return done(null, !token);
};

app.use(
  expressjwt({
    secret: config.ACCESS_TOKEN_SECRET,
    algorithms: ['HS256'],
    isRevoked: isRevokedCallback,
  }).unless(function (req) {
    const invalidRoutes = [
      '/',
      '/api/login'
    ];

    if (invalidRoutes.includes(req.originalUrl)) {
      return true;
    }

    return invalidRoutes.some((route) => {
      const [method, originalUrl] = route.split(' ');

      if (method === req.method && originalUrl === req.originalUrl) {
        return true;
      } else {
        return false;
      }
    });
  }),
);


app.get('/', cors(), (req, res) => {
  res.json({message:'Pablo-Web'});
});

app.post('/api/login', UserController.validateUserCredentials);

app.post('/api/register', UserController.createNewUser);

app.patch('/api/change-password', UserController.updateUserPassword);

app.post('/api/refresh-token', RefreshTokenController.generateNewAccessToken);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.status_code || 500).json({
    error: {...err, message: err.message, stack: err.stack},
  });
});

app.listen(config.PORT, () =>
  console.log(`Server listening on port ${config.PORT}`),
);
