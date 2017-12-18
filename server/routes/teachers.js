const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher.model');
const teachersData = require('../data/storage').teachers;
const utils = require('./utils');

// function getTeacherById(id) {
//   return _.find(teachersData, ['id', id]);
// }

// function getTeacherFromRequest(req) {
//   return req.params && req.params.teacherId && getTeacherById(req.params.teacherId);
// }

// router.get('/', (req, res) => {
//   console.log('get teachers');
//   res.status(200).json(teachersData);
// });

// router.get('/:teacherId', (req, res) => {
//   var match = getTeacherFromRequest(req);

//   if (match) {
//     console.log('GET TEACHER BY ID', match);
//     res.status(200).json(match);
//   } else {
//     res.status(404).json(responses.NOT_MATCH);
//   }
// });

// router.post('/', (req, res) => {
//   try {
//     console.log(req.body);
//     let id = faker.random.uuid();
//     let newTeacher = new Teacher(_.assign({ id }, _.pick(req.body, ['first_name', 'last_name', 'email'])));
//     teachersData.push(newTeacher);
//     console.log('CREATED TEACHER', newTeacher);
//     res.status(200).json(getTeacherById(id));
//   } catch(e) {
//     res.status(500).json(responses.BAD_REQUEST);
//   }
// });

// router.delete('/:teacherId', (req, res) => {
//   var match = getTeacherFromRequest(req);
//   if (match) {
//     _.remove(teachersData, match);
//     console.log('DELETED TEACHER', match);
//     res.status(200).json(responses.DELETED);
//   } else {
//     res.status(404).json(responses.NOT_MATCH);
//   }
// });

router.get('/', (req, res) => utils.getAll(req, res, teachersData, { param: 'query', lookups: ['first_name', 'last_name']}));
router.get('/:teacherId', (req, res) => utils.getById(req, res, 'teacherId', teachersData));
router.post('/', (req, res) => utils.create(req, res, teachersData, Teacher, ['first_name', 'last_name', 'email']));
router.delete('/:teacherId', (req, res) => utils.delete(req, res, 'teacherId', teachersData));
router.patch('/:teacherId', (req, res) => utils.update(req, res, 'teacherId', teachersData));

module.exports = router;