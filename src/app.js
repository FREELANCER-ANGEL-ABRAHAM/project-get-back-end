const config = require('./config');
const express = require('express');
const database = require('./database');
const cors = require('cors');
const expressjwt = require('express-jwt');
const multer = require('multer');
const bodyParser = require('body-parser');

const UserController = require('./controllers/Usercontroller');
const RefreshTokenController = require('./controllers/RefreshTokenController');
const linksController = require('./controllers/Linkcontroller');
const Tokens = require('./models/Token');

const uuid = require('uuid');
const mime = require('mime');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const maxFileSize = 6 * 1024 * 1024;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.use(cors());
database.connect();

const upload = multer({
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      console.log('Image format accepted');
      cb(null, true);
    } else {
      console.log('Image format not allowed');
      cb(
        new Error(
          'Error while uploading image. Only .png and .jpg formats are allowed',
        ),
      );
    }
  },
  limits: { fileSize: maxFileSize },
  storage: multerS3({
    s3: new aws.S3(),
    bucket: config.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {});
    },
    key: function (req, file, cb) {
      cb(null, `${uuid.v4()}.${mime.getExtension(file.mimetype)}`);
    },
  })
});

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
      '/api/login',
      '/api/refresh-token',
      '/api/links'
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

//Users Routes
app.post('/api/login', UserController.validateUserCredentials);

app.post('/api/register', UserController.createNewUser);

app.patch('/api/change-password', UserController.updateUserPassword);

//Token Route
app.post('/api/refresh-token', RefreshTokenController.generateNewAccessToken);

//Links Routes
app.get('/api/links', linksController.loadLinksFromDatabase);

app.post('/api/create-link', upload.single('image'), linksController.saveCredentialsLinks);

app.post('/api/update-link', upload.single('image'), linksController.updateLinkFields);


app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.status_code || 500).json({
    error: {...err, message: err.message, stack: err.stack},
  });
});

app.listen(config.PORT, () =>
  console.log(`Server listening on port ${config.PORT}`),
);
