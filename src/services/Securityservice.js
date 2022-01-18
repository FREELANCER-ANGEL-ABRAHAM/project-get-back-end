const bcrypt = require('bcrypt');

async function createHash(text){
  return await bcrypt.hash(text, await bcrypt.genSalt());
}

module.exports = { createHash, };