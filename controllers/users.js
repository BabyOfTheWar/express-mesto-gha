const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const constants = require('../utils/constants');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(constants.HTTP_STATUS.OK)
      .json(users);
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);

    if (user) {
      return res.status(constants.HTTP_STATUS.OK)
        .json({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        });
    }
    return res.status(constants.HTTP_STATUS.NOT_FOUND)
      .send({ message: constants.ERROR_MESSAGES.NOT_FOUND_MESSAGE });
  } catch (error) {
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  const {
    name = 'Жак-Ив Кусто',
    about = 'Исследователь',
    avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    email,
    password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    const userWithoutPassword = {
      ...user.toObject(),
      password: undefined,
    };

    return res.status(constants.HTTP_STATUS.CREATED)
      .json(userWithoutPassword);
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (req, res, next) => {
  const userId = req.user._id;
  const {
    name,
    about,
  } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (updatedUser) {
      return res.status(constants.HTTP_STATUS.OK)
        .json(updatedUser);
    }
    return res.status(constants.HTTP_STATUS.NOT_FOUND)
      .send({ message: constants.ERROR_MESSAGES.NOT_FOUND_MESSAGE });
  } catch (error) {
    return next(error);
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
      return res.status(constants.HTTP_STATUS.OK)
        .json(updatedUser);
    }
    return res.status(constants.HTTP_STATUS.NOT_FOUND)
      .send({ message: constants.ERROR_MESSAGES.NOT_FOUND_MESSAGE });
  } catch (error) {
    return next(error);
  }
};

const getUserMe = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(constants.HTTP_STATUS.NOT_FOUND)
        .json({ message: constants.ERROR_MESSAGES.NOT_FOUND_MESSAGE });
    }
    return res.status(constants.HTTP_STATUS.OK)
      .json(user);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  try {
    const user = await User.findOne({ email })
      .select('+password');

    if (!user) {
      return res.status(constants.HTTP_STATUS.UNAUTHORIZED)
        .send({ message: 'Неправильные почта или пароль' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(constants.HTTP_STATUS.UNAUTHORIZED)
        .send({ message: 'Неправильные почта или пароль' });
    }

    const token = jwt.sign({ _id: user._id }, constants.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('jwt', token, { httpOnly: true });
    return res.status(constants.HTTP_STATUS.OK)
      .send({ token });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getUserMe,
};
