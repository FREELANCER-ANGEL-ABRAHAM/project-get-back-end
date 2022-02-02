const { userLogin, changeUserPassword, NewUser } = require('../services/Userservice');
const { generateAccessToken, generateRefreshToken } = require('../services/Jwtservice');

async function validateUserCredentials(req, res, next) {
    const credentials = {username: req.body.username, password: req.body.password};

    try{
        const user = await userLogin(credentials);
        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);
        return res.json({ accessToken: accessToken, refreshToken: refreshToken });
    }catch(err){
        next(err);
    }
}

async function updateUserPassword(req, res, next) {
    const credentials = {username: req.body.username, password: req.body.password, secret: req.body.secret};

    try{
        await changeUserPassword(credentials);
        return res.json({ user: req.user});
    }catch(err){
        next(err);
    }
}

async function createNewUser(req, res, next) {
  const credentials = {username: req.body.username, password: req.body.password, secret: req.body.secret};

  try{
      await NewUser(credentials);
      return res.json({message: "User Created Successfully"});
  }catch(err){
      next(err);
  }
}

module.exports = {validateUserCredentials, updateUserPassword, createNewUser};