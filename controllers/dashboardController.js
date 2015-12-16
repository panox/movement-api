var User = require('../models/user');


function getActivities(req, res) {
  User.findOne(req.body.email).populate('activities', 'date type steps').exec(function(err, user) {
    console.log(user.activities)
    if (err) {
      return res.status(404).json({
        message: 'Something went wrong showing the home' + err
      });
    }
    res.status(200).json({
      user: user
    });
  });
}

// TODO Check if user has activities before displaying the data on the front-end

function checkForActivities(req, res) {

}

module.exports = {
  getActivities: getActivities
};
