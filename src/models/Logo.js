const mongoose = require('mongoose');
const schema = mongoose.Schema;

const LogoSchema = schema({
  image: {type: String, required: true},
  status: {type: String, required: true}
});

const Logo = mongoose.model('Logo', LogoSchema);
module.exports = Logo;
