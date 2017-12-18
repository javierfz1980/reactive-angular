const students = require('./students');
const courses = require('./courses');
const profiles = require('./profiles');
const teachers = require('./teachers');
const login = require('./login');
const account = require('./account');
const token = require('../config/token');
const responses = require('./responses');

function authorize(req, res, next) {
  if (!req.headers.token || req.headers.token !== token) {
    res.status(401).json(responses.UNAUTHORIZE);
  } else {
    next();
  }
}

module.exports = {
  register: function(app) {
    app.use('/students', authorize, students);
    app.use('/courses', authorize, courses);
    app.use('/teachers', authorize, teachers);
    app.use('/profiles', authorize, profiles);
    app.use('/login', login);
    app.use('/account', authorize, account);
  }
};