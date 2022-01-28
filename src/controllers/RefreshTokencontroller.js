const {generateTokenPair, deleteTokenPair, verifyRefreshToken} = require('../services/Jwtservice');

async function generateNewAccessToken(req, res, nest) {
  try{
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader.split(' ')[1];
    const verify = await verifyRefreshToken(refreshToken);

    if(!verify){
      throw {
        code: 'INVALID_TOKEN',
        message: 'The provided refresh token is not valid.',
      };
    } else{
      delete verify.iat;
      delete verify.exp;
      delete verify.nbf;
      delete verify.jti;

      const deletedTokens = await deleteTokenPair(refreshToken);
      const tokens = await generateTokenPair(verify);

      return res.json({ newTokens: tokens, deleted: deletedTokens });
    }
  }catch(err){
    next(err);
  }
}

module.exports = {generateNewAccessToken};
