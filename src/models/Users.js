const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { createHash } = require('../services/Securityservice');

const userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
});

userSchema.pre('save', async function updatePasswordOnSave(next) {
  if(this.isModified('password')) {
    this.password = await createHash(this.password);
  }
  next();
});

userSchema.set('toJSON', {
  transform: (obj, doc) => {
    delete doc.password;
    return doc;
  }
});

userSchema.set('toObject', {
  transform: (obj, doc) => {
    delete doc.password;
    return doc;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
