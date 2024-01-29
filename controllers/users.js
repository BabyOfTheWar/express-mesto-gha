const mongoose = require('mongoose');
const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({ message: 'Некорректный формат ID пользователя' });
  }

  try {
    const user = await User.findById(userId);

    if (user) {
      return res.status(200).json({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    }
    return res.status(404).send({ message: 'Пользователь не найден' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Неверный запрос' });
    }
    return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
  }
};

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name || name.length < 2 || name.length > 30) {
    return res.status(400).send({ message: 'Некорректная длина поля name' });
  }

  if (!about || about.length < 2 || about.length > 30) {
    return res.status(400).send({ message: 'Некорректная длина поля about' });
  }

  if (!avatar) {
    return res.status(400).send({ message: 'В запросе отсутствует обязательное поле avatar' });
  }

  try {
    const user = await User.create({ name, about, avatar });
    return res.status(201).json(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Неверный запрос' });
    }
    return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  if (name && (name.length < 2 || name.length > 30)) {
    return res.status(400).send({ message: 'Некорректная длина поля name' });
  }

  if (about && (about.length < 2 || about.length > 30)) {
    return res.status(400).send({ message: 'Некорректная длина поля about' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (updatedUser) {
      return res.status(200).json(updatedUser);
    }
    return res.status(404).send({ message: 'Пользователь не найден' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Неверный запрос' });
    }
    return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
  }
};

const updateAvatar = async (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true },
    );

    if (updatedUser) {
      return res.status(200).json(updatedUser);
    }
    return res.status(404).send({ message: 'Пользователь не найден' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Неверный запрос' });
    }
    return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
  }
};

module.exports = {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
};
