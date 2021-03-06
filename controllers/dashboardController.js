var User = require('../models/user');
var mongoose = require('mongoose');

function getActivities(req, res) {
  User.findOne({'local.email': req.body.email}, function(err, user) {
    if (err) {
      return res.status(404).json({
        message: 'Something went wrong showing the user' + err
      });
    }
    res.status(200)
    .json({
      activities: user.local.activities
    });
  });
}

function countSteps(userEmail) {
  mongoose.User.aggregate([
    { $match: {
        email: userEmail
    }},
    { $unwind: "$activities" },
    { $group: {
        _id: "$_id",
        balance: { $sum: "$activities.steps"  }
    }}
  ], function (err, result) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(result);
  });
}

// TODO Check if user has activities before displaying the data on the front-end

function checkForActivities(req, res) {

}

// TODO Display places visited on a map

function displayPlaces(req, res) {
  
}

module.exports = {
  getActivities: getActivities,
  countSteps: countSteps
};
