const express = require('express');
const router = express.Router();
const Course = require('../models/course.model');
const coursesData = require('../data/storage').courses;
const utils = require('./utils');

router.get('/', (req, res) => utils.getAll(req, res, coursesData, { param: 'query', lookups: ['title', 'short_description']}));
router.get('/:courseId', (req, res) => utils.getById(req, res, 'courseId', coursesData));
router.post('/', (req, res) => utils.create(req, res, coursesData, Course, ['title', 'short_description', 'detail', 'active']));
router.delete('/:courseId', (req, res) => utils.delete(req, res, 'courseId', coursesData));
router.patch('/:courseId', (req, res) => utils.update(req, res, 'courseId', coursesData));

module.exports = router;