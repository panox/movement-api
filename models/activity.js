var mongoose = require('mongoose');

var activitySchema = new mongoose.Schema({
  activityType: {type: String},
  steps: {type: String},
  date: {type: String}
});

module.exports = mongoose.model('Activity', activitySchema);
