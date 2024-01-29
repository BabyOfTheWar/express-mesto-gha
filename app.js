const express = require('express');

const mongoose = require('mongoose');

const helmet = require('helmet');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '65b6a8783c3ac01180aab46e',
  };
  next();
});

app.use(helmet());

app.use(express.json());

const usersRouter = require('./routes/users');

app.use('/', usersRouter);

const cardsRouter = require('./routes/cards');

app.use('/', cardsRouter);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Такой страницы нет' });
});

app.listen(PORT);
