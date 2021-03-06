var http = require('http');
var MovesApi = require('../lib/MovesApi').MovesApi;
var config = require('../config/moves.json');
var fs = require('fs');
var User = require('../models/user');
var Activity = require('../models/activity');
var request = require('request');
var querystring = require('querystring');
var moment = require('moment');
var url = require('url');

var movesCredentials = {
  clientId: process.env.MOVES_CLIENT,
  clientSecret: process.env.MOVES_SECRET,
  redirectUri: process.env.MOVES_REDIRECT
};

var moves = new MovesApi(movesCredentials);

function handleRequest(req, res) {
  var authCode = req.body.code;
  console.log(authCode);
  userEmail = req.body.email;
  console.log(userEmail);
  if (authCode) {
    moves.getAccessToken(authCode, function(err, authData) {
      if (err) {
        res.end('Moves API Error: ' + err);
        return;
      }
      User.findOne({'local.email': userEmail}, function(err, user) {
        if (err) {
          return done(err, false, {message: 'Something went wrong.'});
        }
        if (!user) {
          return done(err, false, {message: 'No user found.'});
        }
        if (user) {
          user.local.accessToken = authData.access_token;
          user.local.refreshToken = authData.refresh_token;
          user.local.userId = authData.user_id;
          user.save(function(err, user) {
            if (err) {
              return done(err, false, {message: 'Something went wrong.'});
            }
            return done(null, user);
            console.log(user);
          });
        }
      });
      res.status(200).json(authData);
    });
    return;
  } else {
    res.status(401);
  }
}

function getSummary(req, res) {
  var self = this;
  self.userEmail = req.body.email;
  self.accessToken = '';
  User.findOne({'local.email': self.userEmail}, function(err, user) {
    if (err) {
      throw new Error('Something went wrong.');
    }
    if (!user) {
      throw new Error('No user found.');
    }
    if (user) {
      self.accessToken = user.local.accessToken;
      getRequest('/user/summary/daily?pastDays=31&scope=activity',
      self.userEmail, self.accessToken, function(err, res) {
        if (err) {
          throw new Error('Something went wrong');
        }
        return;
      });
    }
  });
}

function getRequest(call, userEmail, accessToken, callback) {
  var apiBase = 'https://api.moves-app.com/api/1.1';
  if (!call) {
    throw new Error('Call is required. Please refer to the Moves docs.');
  }
  if (!accessToken) {
    throw new Error('Valid access token is required');
  }
  var getUrl = apiBase += call += ('&access_token=' + accessToken);
  console.log(getUrl);
  request.get({url: url.format(getUrl), json: true}, function(err, res) {
    if (err) {
      throw new Error('Something went wrong.');
    }
    saveSummary(res.body, userEmail);
  });
}

// TODO changeDate function not working correctly

function changeDate(oldDate) {
  var date = oldDate.split('');
  var year = date[0] + date[1] + date[2] + date[3];
  var month = (date[4] + date[5]) - 1;
  var day = date[6] + date[7];
  var jsDate = new Date(year, month, day);
  var formatDate = (jsDate.toDateString()).split(' ');
  var formattedDate = formatDate[0] + ', ' + formatDate[2] + ' ' +
    formatDate[1];
  return formattedDate;
}

function saveSummary(data, userEmail) {
  User.findOne({'local.email': userEmail}, function(err, user) {
    if (err) {
      throw new Error('User not found.');
    }
    data.forEach(function(item) {
      item.summary.forEach(function(summaryObj) {
        if (summaryObj.activity === 'walking') {
          user.local.activities.push({
            activityType: summaryObj.activity,
            steps: summaryObj.steps,
            date: changeDate(item.date)
          });
        }
      });
    });
    user.save(function(err, user) {
      if (err) {
        throw new Error('User could not be saved');
      }
      res.status(200).json(user);
    });
  });
}

module.exports = {
  handleRequest: handleRequest,
  getSummary: getSummary
};
