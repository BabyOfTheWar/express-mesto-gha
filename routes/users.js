const express = require('express');

const {getUsers, getUserById, createUser, updateProfile, updateAvatar} = require('../controllers/users');

const router = express.Router();

router.get('/users', getUsers);

router.get('/users/:userId', getUserById);

router.post('/users', createUser);

router.post('/users', updateProfile);

router.post('/users', updateAvatar);

module.exports = router;
