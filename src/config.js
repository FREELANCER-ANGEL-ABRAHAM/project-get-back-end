require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 80,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  DB_WITH_URL: process.env.DB_WITH_URL || 'mongodb://localhost/test',
  ADMIN_RESET_SECRET: process.env.ADMIN_RESET_SECRET,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
}
