const config = require('../config');
const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

async function generateTokenPair(user){
  const accessToken = jwt.sign(user, config.ACCESS_TOKEN_SECRET, {
    expiresIn: '6h',
  });

  const refreshToken = jwt.sign(user, config.REFRESH_TOKEN_SECRET, {
    expiresIn: '1d',
  });

  const tokens = {accessToken: accessToken, refreshToken: refreshToken};

  await saveTokenPair(tokens);

  return tokens;
}


async function saveTokenPair(tokenPair){
  const token = new Token(tokenPair);
  token.save();
}

async function deleteTokenPair(refreshToken) {
  const deletedTokens = await Token.deleteOne({ refreshToken: refreshToken });

  if (deletedTokens.deletedCount === 0) {
    throw {
      code: 'INVALID_TOKEN',
      message: 'The provided refresh token is no longer valid',
    };
  }

  return deletedTokens;
}

async function verifyRefreshToken(refreshToken) {
  const verification = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
  return verification;
}

module.exports = {
  generateTokenPair,
  deleteTokenPair,
  verifyRefreshToken,
};
