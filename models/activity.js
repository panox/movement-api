var mongoose = require('mongoose');

var activitySchema = new mongoose.Schema({
  date: {type: Date},
  type: {type: String},
  steps: {type: String}
});

module.exports = mongoose.model('Activity', activitySchema);
