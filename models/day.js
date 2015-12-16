var mongoose = require('mongoose');
var Activity = require('./activity');

var daySchema = new mongoose.Schema({
  date: {type: String},
  activities: [Activity]
});

module.exports = mongoose.model('Day', daySchema);
