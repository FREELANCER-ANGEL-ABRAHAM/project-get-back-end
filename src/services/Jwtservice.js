const config = require('../config');
const jwt = require('jsonwebtoken');

async function generateAccessToken(user) {
  const accessToken = jwt.sign(user, config.ACCESS_TOKEN_SECRET, {
    expiresIn: '6h',
  });
  return accessToken;
}

async function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, config.REFRESH_TOKEN_SECRET, {
    expiresIn: '1d',
  });
  return refreshToken;
}

async function verifyRefreshToken(refreshToken) {
  const verification = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
  return verification;
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
