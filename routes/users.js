const express = require('express');

const {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
  getUserMe,
} = require('../controllers/users');

const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/users', authMiddleware, getUsers);

router.get('/users/me', authMiddleware, getUserMe);

router.get('/users/:userId', authMiddleware, getUserById);

router.post('/users', authMiddleware, createUser);

router.patch('/users/me',authMiddleware, updateProfile);

router.patch('/users/me/avatar', authMiddleware, updateAvatar);

module.exports = router;
