const { userLogin, changeUserPassword } = require('../services/Userservice');
const { generateAccessToken, generateRefreshToken } = require('../services/Jwtservice');

async function validateUserCredentials(req, res, next) {
    const credentials = {username: req.body.username.toString(), password: req.body.password.toString()};

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
    const credentials = {username: req.body.username.toString(), password: req.body.password.toString(), secret: req.body.secret.toString()};

    try{
        await changeUserPassword(credentials);
        return res.json({ user: req.user});
    }catch(err){
        next(err);
    }
}

module.exports = {validateUserCredentials, updateUserPassword };
