const config = require('../config');
const User = require('../models/Users');
const bcrypt = require('bcrypt');

async function userLogin(credentials){
  if(credentials.username == undefined){
    throw new Error( 'Please provide an username');
  }
  if(credentials.password == undefined){
    throw new Error( 'Please provide a password');
  }

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

module.exports = { userLogin, changeUserPassword,  };
