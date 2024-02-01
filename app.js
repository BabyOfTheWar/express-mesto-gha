const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const joi = require('joi');
const authMiddleware = require('./middlewares/auth');
const errorHandler = require('./middlewares/err-handler');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const signupSchema = joi.object({
  name: joi.string().min(2).max(30),
  email: joi.string().email().required(),
  password: joi.string().min(5).required(),
  about: joi.string().min(2).max(30),
  avatar: joi.string().pattern(/https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#@!$&'()*+,;=]+$/),
});

const usersController = require('./controllers/users');

app.post('/signup', (req, res, next) => {
  const { error } = signupSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  return next();
}, usersController.createUser);

app.post('/signin', usersController.login);

app.use(authMiddleware);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => res.status(404).json({ message: 'Такой страницы нет' }));

app.use(errorHandler);

app.listen(PORT);
