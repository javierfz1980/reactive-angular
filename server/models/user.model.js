var isEmail = require('validator/lib/isEmail');
var _ = require('lodash');

module.exports = function User(props) {
  if (!props.first_name || !props.last_name || !props.email || !isEmail(props.email)) {
    console.log('Cannot create user, bad params');
    console.log('props', props);
    throw new Error('Cannot create user');
  }
  _.assign(this, props);
};