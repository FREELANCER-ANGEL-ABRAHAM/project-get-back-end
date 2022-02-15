const config = require('../config');
const User = require('../models/Users');
const bcrypt = require('bcrypt');

async function userLogin(credentials){
  const user = await User.findOne({ username: credentials.username.toString() });
  if(!user){
    throw new Error( `Invalid Credentials, don't have user with that name`);
  }
  else if(!(await bcrypt.compare(credentials.password.toString(), user.password.toString() ))){
    throw new Error( `Invalid Credentials, passwords don't match `);
  }

  return user.toObject();
}

async function changeUserPassword(credentials){
  if (credentials.secret !== config.ADMIN_RESET_SECRET) {
    throw new Error( 'The provided secret is not valid');
  }
  else if (!credentials.username || !credentials.password) {
    throw new Error( 'Please provide username and password');
  }
  else{
    const user = await User.findOne({ username: credentials.username });

    if (!user) {
      throw new Error( 'User not found');
    }

    user.password = credentials.password;

    await user.save();
    return user;
  }

}

async function NewUser(credentials){
  if (credentials.secret !== config.ADMIN_RESET_SECRET) {
    throw new Error( 'The provided secret is not valid');
  }
  else if (!credentials.username || !credentials.password) {
    throw new Error( 'Please provide username and password');
  }
  else{
    const user = await User.findOne({ username: credentials.username });

    if (user) {
      throw new Error( 'There is already a user with that name');
    }

    const {username, password} = credentials;
    const newUser = new User({ username, password });

    await newUser.save();

    return newUser;
  }
}


module.exports = { userLogin, changeUserPassword, NewUser,  };
