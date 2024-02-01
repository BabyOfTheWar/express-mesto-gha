const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Неверный запрос' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ message: 'Некорректный формат ID' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Некорректный токен' });
  }

  if (err.message === 'Требуется авторизация') {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  if (err.name === 'NotFoundError' || err.code === 404) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }

  if(err.name === 'nameLengthErr') {
    return res.status(404).json({ message: 'Некорректная длина поля name' });
  }

  return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
};

module.exports = errorHandler;
