const config = require('./config');
const express = require('express');
const database = require('./database');
const cors = require('cors');
const expressjwt = require('express-jwt');
const multer = require('multer');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const UserController = require('./controllers/Usercontroller');
const RefreshTokenController = require('./controllers/RefreshTokencontroller');
const linksController = require('./controllers/Linkcontroller');

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

app.use(
  expressjwt({
    secret: config.ACCESS_TOKEN_SECRET,
    algorithms: ['HS256'],
  }).unless(function (req) {
    const invalidRoutes = [
      '/',
      '/api/login',
      '/api/change-password',
      '/api/refresh-token',
      '/api/link',
      '/api/logo',
      '/api/update-link-count-click'
    ];

    if (invalidRoutes.includes(req.originalUrl)) {
      return true;
    }

    return invalidRoutes.some((route) => {
      const [method, originalUrl] = route.split(' ');

      return method === req.method && originalUrl === req.originalUrl ? true : false;
    });
  }),
);


app.get('/', cors(), (req, res) => {
  res.json({message:'Pablo-Web'});
});

//Users Routes
app.post('/api/login', UserController.validateUserCredentials);

app.patch('/api/change-password', UserController.updateUserPassword);

//Token Route
app.post('/api/refresh-token', RefreshTokenController.generateNewAccessToken);

//Links Routes
app.get('/api/link', linksController.loadLinkFromDatabase);

app.get('/api/links', linksController.loadAllLinksFromDataBase);

app.get('/api/logo', linksController.loadLogoFromDatabase);

app.get('/api/link_id/:id', linksController.loadLinkById);

app.post('/api/create-link', upload.single('image'), linksController.saveCredentialsLinks);

app.post('/api/create-logo', upload.single('image'), linksController.saveCredentialsLogo);

app.patch('/api/update-link', upload.single('image'), linksController.updateLinkFields);

app.patch('/api/update-link-count-click', linksController.updateClickLinkField);

app.patch('/api/update-link-active_at', linksController.updateLinkFieldActiveAt);

app.delete('/api/delete-link/:id', linksController.deleteLinkFromDatabase);



app.use(function (err, req, res, next) {
  res.status(err.status_code || 500).json({
    error: {...err, message: err.message, stack: err.stack},
  });
});

module.exports = app.listen(config.PORT, () =>
  console.log(`Server listening on port ${config.PORT}`),
);
