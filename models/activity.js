var mongoose = require('mongoose');

var activitySchema = new mongoose.Schema({
  type: {type: String},
  steps: {type: String}
});

module.exports = mongoose.model('Activity', activitySchema);
