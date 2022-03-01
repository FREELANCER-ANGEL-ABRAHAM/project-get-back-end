const mongoose = require('mongoose');
const schema = mongoose.Schema;

const tokensSchema = schema({
    accessToken: {type: String, required: true},
    refreshToken: {type: String, required: true},
});

const Tokens = mongoose.model('Token', tokensSchema);
module.exports = Tokens;
