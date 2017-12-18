const express = require('express');
const router = express.Router();
const Profile = require('../models/profile.model');
const profilesData = require('../data/storage').profiles;
const utils = require('./utils');

router.get('/', (req, res) => utils.getAll(req, res, profilesData));
router.get('/:profileId', (req, res) => utils.getById(req, res, 'profileId', profilesData));
router.post('/', (req, res) => utils.create(req, res, profilesData, Profile, ['birthday', 'contact.street', 'contact.state', 'contact.country', 'contact.city', 'contact.zip', 'contact.phone', 'avatar', 'secondary_email']));
router.delete('/:profileId', (req, res) => utils.delete(req, res, 'profileId', profilesData));
router.patch('/:profileId', (req, res) => utils.update(req, res, 'profileId', profilesData));

module.exports = router;