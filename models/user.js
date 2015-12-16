var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Activity = require('./activity')

var userSchema = new mongoose.Schema({
  local: {
    username: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    avatar: {type: String},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    accessToken: {type: String},
    refreshToken: {type: String},
    userId: {type: String},
    activities: [Activity.schema]
  }
});

userSchema.statics.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
