var User = require('./user.model');
var _ = require('lodash');

module.exports = function Student(props) {
  var user = new User(props);
  _.assign(this, user);
};