const config = require('../config');
const User = require('../models/Users');
const bcrypt = require('bcrypt');

async function userLogin(credentials){
  const user = await User.findOne({ username: credentials.username });

  if(!user){
    throw{
      code: 'INVALID_LOGIN',
      message: 'Invalid Credentials',
      status_code: 401,
    };
  }
  else if(!(await bcrypt.compare(credentials.password, user.password))){
    throw {
      code: 'INVALID_LOGIN',
      message: 'Invalid credentials',
      status_code: 401,
    };
  }

  return user.toObject();
}

async function changeUserPassword(credentials){
  if (credentials.secret !== config.ADMIN_RESET_SECRET) {
    throw {
      code: 'INVALID_SECRET',
      message: 'The provided secret is not valid.',
    };
  }
  else if (!credentials.username || !credentials.password) {
    throw {
      code: 'MISSING_FIELDS',
      message: 'Please provide username and password',
    };
  }
  else{
    const user = await User.findOne({ username: credentials.username });

    if (!user) {
      throw {
        code: 'INVALID_DATA',
        message: 'User not found',
      };
    }

    user.password = credentials.password;

    await user.save();
    return user;
  }

}

async function NewUser(credentials){
  if (credentials.secret !== config.ADMIN_RESET_SECRET) {
    throw {
      code: 'INVALID_SECRET',
      message: 'The provided secret is not valid.',
    };
  }
  else if (!credentials.username || !credentials.password) {
    throw {
      code: 'MISSING_FIELDS',
      message: 'Please provide username and password',
    };
  }
  else{
    const user = await User.findOne({ username: credentials.username });

    if (user) {
      throw {
        code: 'INVALID_DATA',
        message: 'There is already a user with that name',
      };
    }

    const {username, password} = credentials;
    const newUser = new User({ username, password });

    await newUser.save();

    return newUser;
  }
}


module.exports = { userLogin, changeUserPassword, NewUser,  };
