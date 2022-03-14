const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const schema = mongoose.Schema;

const linkSchema = new schema({
  name: {type: String, required: true},
  title: {type: String, required: false},
  description: {type: String, required: false},
  btn_name: {type: String, required: true},
  url: {type: String, required: true},
  image: {type: String, required: false},
  visibility: {type: String, required: true},
  status: {type: String, required: true},
  detail_result: {type: String, required: true},
  contain_result: {type: String, required: true},
  count_click: {type: Number, required: true},
  active_at: {type: String, default: ''},
});

linkSchema.plugin(mongoosePaginate);
const Link = mongoose.model('Link', linkSchema);

module.exports = Link;
