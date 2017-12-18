const express = require('express');
const router = express.Router();
const Student = require('../models/student.model');
const studentsData = require('../data/storage').students;
const utils = require('./utils');

router.get('/', (req, res) => utils.getAll(req, res, studentsData, { param: 'query', lookups: ['first_name', 'last_name']}));
router.get('/:studentId', (req, res) => utils.getById(req, res, 'studentId', studentsData));
router.post('/', (req, res) => utils.create(req, res, studentsData, Student, ['first_name', 'last_name', 'email']));
router.delete('/:studentId', (req, res) => utils.delete(req, res, 'studentId', studentsData));
router.patch('/:studentId', (req, res) => utils.update(req, res, 'studentId', studentsData));


module.exports = router;