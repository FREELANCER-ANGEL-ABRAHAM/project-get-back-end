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
  try{
    if(!req.body.username){
      throw new Error( 'username must be provided');
    }
    if(!req.body.password){
      throw new Error( 'actual password must be provided');
    }
    if(!req.body.newPassword){
      throw new Error( 'new password must be provided');
    }
    const credentials = {username: req.body.username.toString(), password: req.body.password.toString()};

    await changeUserPassword(credentials, req.body.newPassword.toString());
    return res.json({message: 'Update Password Successfully'});
  }catch(err){
    next(err);
  }
}

module.exports = {validateUserCredentials, updateUserPassword };
