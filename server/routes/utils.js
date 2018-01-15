const _ = require('lodash');
const responses = require('./responses');
const faker = require('faker');

function getDataById(data, id) {
  return _.find(data, ['id', id]);
}

function getDataFromRequest(req, param, data) {
  return req.params && req.params[param] && getDataById(data, req.params[param]);
}

exports.getAll = function(req, res, data, filter) {
  var result = data;
  if (filter && req.query[filter.param]) {
    result = _.filter(result, (input) => {
      console.log(filter.lookups);
      return _.some(filter.lookups, lookup => {
        console.log(lookup);
        console.log(input[lookup]);
        console.log(req.query[filter.param]);
        console.log(input[lookup].includes(req.query[filter.param]));
        return input[lookup].toLowerCase().includes(req.query[filter.param].toLowerCase());
      });
    });
  }
  res.status(200).json(result);
};

exports.getById = function(req, res, param, data) {
  var match = getDataFromRequest(req, param, data);

  if (match) {
    res.status(200).json(match);
  } else {
    res.status(404).json(responses.NOT_MATCH);
  }
};

exports.create = function(req, res, data, Constructor, picks) {
  try {
    console.log(req.body);
    let id = faker.random.uuid();
    // let newProfile = new Profile(_.assign({ id }, _.pick(req.body, ['birthday', 'contact.street', 'contact.state', 'contact.country', 'contact.city', 'contact.zip', 'contact.phone', 'avatar', 'secondary_email'])));
    let newInstance = new Constructor(_.assign({ id }, _.pick(req.body, picks)));
    data.push(newInstance);
    console.log('CREATED', newInstance);
    res.status(200).json(getDataById(data, id));
  } catch(e) {
    console.log(e);
    res.status(500).json(responses.BAD_REQUEST);
  }
};

exports.delete = function(req, res, param, data) {
  var match = getDataFromRequest(req, param, data);
  if (match) {
    _.remove(data, match);
    console.log('DELETED', match);
    res.status(200).json(responses.DELETED);
  } else {
    res.status(404).json(responses.NOT_MATCH);
  }
};

exports.update = function(req, res, param, data) {
  if (_.isEmpty(req.body) || req.body.id) {
    res.status(400).json(responses.BAD_REQUEST);
    return;
  }
  var match = getDataFromRequest(req, param, data);

  if (match) {
    _.assign(match, req.body || {});
    res.status(200).json(match);
  } else {
    res.status(404).json(responses.NOT_MATCH);
  }
};