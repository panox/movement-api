var express  = require('express');
var router   = express.Router();
var passport = require('passport');

var usersController = require('../controllers/usersController');
var importController = require('../controllers/importController');
var importController = require('../controllers/dashboardController');
var authenticationController
  = require('../controllers/authenticationController');

router.post('/login', authenticationController.login);
router.post('/register', authenticationController.register);

router.route('/moves/auth')
  .post(importController.handleRequest);

router.route('/moves/summary')
  .post(importController.getSummary);

router.route('/activities')
  .get(dashboardController.getActivities);

router.route('/users')
  .get(usersController.usersIndex);

router.route('/users/:id')
  .get(usersController.usersShow)
  .put(usersController.usersUpdate)
  .patch(usersController.usersUpdate)
  .delete(usersController.usersDelete);

module.exports = router;
