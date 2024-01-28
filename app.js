const express = require('express');
const mongoose = require('mongoose');
const {PORT = 3000} = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
    req.user = {
        _id: '65b6a8783c3ac01180aab46e' // Вставьте сюда _id созданного в предыдущем пункте пользователя
    };
    next();
});

app.use(express.json());

const usersRouter = require('./routes/users');
app.use('/', usersRouter);

const cardsRouter = require('./routes/cards');
app.use('/', cardsRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
