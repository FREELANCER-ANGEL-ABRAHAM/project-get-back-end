const { userLogin, changeUserPassword } = require('../services/Userservice');
const { generateAccessToken, generateRefreshToken } = require('../services/Jwtservice');

async function validateUserCredentials(req, res, next) {
    const credentials = {username: req.body.username, password: req.body.password};

    try{
        const user = await userLogin(credentials);
        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);
        const tokens = { accessToken: accessToken, refreshToken: refreshToken };
        return res.json({ tokens });
    }catch(err){
        next(err);
    }
}

async function updateUserPassword(req, res, next) {
  const credentials = {username: req.body.username, password: req.body.password};

  try{
      await changeUserPassword(credentials);
      return res.json({ user: req.user});
  }catch(err){
      next(err);
  }
}

module.exports = {validateUserCredentials, updateUserPassword };
