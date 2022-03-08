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

async function changeUserPassword(credentials, newPassword){
  if(credentials.username === undefined){
    throw new Error( 'username must be provided');
  }
  if(credentials.password === undefined){
    throw new Error( 'actual password must be provided');
  }
  if(newPassword === undefined){
    throw new Error( 'new password must be provided');
  }

  const user = await User.findOne({ username: credentials.username.toString() });
  if(!user) {
    throw new Error( 'User not found');
  }

  if(!newPassword){
    throw new Error( 'Please provide a new password');
  }

  if(!(await bcrypt.compare(credentials.password.toString(), user.password.toString()))){
    throw new Error( `Invalid Credentials, passwords don't match `);
  }
  user.password = newPassword;
  await user.save();
  return 'Updated';
}

module.exports = { userLogin, changeUserPassword,  };
