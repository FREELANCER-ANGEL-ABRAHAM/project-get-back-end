const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const schema = mongoose.Schema;

const linkSchema = new schema({
  name: {type: String, required: true},
  title: {type: String, required: true},
  description: {type: String, required: true},
  btn_name: {type: String, required: true},
  url: {type: String, required: true},
  image: {type: String, required: true},
  visibility: {type: String, required: true},
  status: {type: String, required: true}
});

linkSchema.plugin(mongoosePaginate);
const Link = mongoose.model('Link', linkSchema);

module.exports = Link;
