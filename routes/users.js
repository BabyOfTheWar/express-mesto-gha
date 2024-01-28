const express = require('express');

const {getUsers, getUserById, createUser, updateProfile, updateAvatar} = require('../controllers/users');

const router = express.Router();

router.get('/users', getUsers);

router.get('/users/:userId', getUserById);

router.post('/users', createUser);

router.patch('/users/me', updateProfile);

router.patch('/users/me/avatar', updateAvatar);

router.all('*', (req, res) => {
    res.status(404).send({ message: 'страницы не существует' });
});

module.exports = router;
