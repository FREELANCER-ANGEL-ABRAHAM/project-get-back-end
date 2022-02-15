const config = require('../config');
const jwt = require('jsonwebtoken');

async function generateAccessToken(user) {
  return accessToken = jwt.sign(user, config.ACCESS_TOKEN_SECRET, {
    expiresIn: '6h',
  });;
}

async function generateRefreshToken(user) {
  return refreshToken = jwt.sign(user, config.REFRESH_TOKEN_SECRET, {
    expiresIn: '1d',
  });
}

async function verifyRefreshToken(refreshToken) {
  return verification = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
