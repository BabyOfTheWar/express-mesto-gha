const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
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
    next(error);
  }
};

const createUser = async (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (!name || name.length < 2 || name.length > 30) {
    return res.status(400).send({ message: 'Некорректная длина поля name' });
  }

  if (!about || about.length < 2 || about.length > 30) {
    return res.status(400).send({ message: 'Некорректная длина поля about' });
  }

  if (!avatar) {
    return res.status(400).send({ message: 'В запросе отсутствует обязательное поле avatar' });
  }

  if (!email || !password) {
    return res.status(400).send({ message: 'В запросе отсутствуют обязательные поля email и password' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, about, avatar, email, password: hashedPassword });
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
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
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
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
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'В запросе отсутствуют обязательные поля email и password' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).send({ message: 'Неправильные почта или пароль' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Неправильные почта или пароль' });
    }

    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
