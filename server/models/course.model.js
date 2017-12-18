var _ = require('lodash');

module.exports = function Course(props) {
  if (!props.title || !props.short_description || !props.detail) {
    console.log('Cannot create user, bad params');
    console.log('props', props);
    throw new Error('Cannot create course');
  }
  _.assign(this, props);

  this.active = !!this.active;
};