var _ = require('lodash');

const MANDATORY = [
  'birthday',
  'contact.street',
  'contact.state',
  'contact.country',
  'contact.city',
  'contact.zip',
  'contact.phone',
];

module.exports = function Profile(props) {
  var fail = _.some(MANDATORY, fieldPath => {
    return !_.get(props, fieldPath);
  });

  if (fail) {
    console.log('Cannot create profile, bad params');
    console.log('props', props);
    throw new Error('Cannot create profile');
  }

  _.each(MANDATORY, fieldPath => {
    _.set(this, fieldPath, _.get(props, fieldPath));
  });

  _.assign(this, _.pick(props, ['id', 'avatar', 'secondary_email']));
};