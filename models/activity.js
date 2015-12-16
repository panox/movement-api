var mongoose = require('mongoose');

var activitySchema = new mongoose.Schema({
  activityType: {type: String},
  steps: {type: String},
  date: {type: Date}
});

module.exports = mongoose.model('Activity', activitySchema);
