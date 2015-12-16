module.exports = {
  'secret': 'movementsAppSecret',
  'database': process.env.MONGOLAB_URI || 'mongodb://localhost/movements-app-db'
};
