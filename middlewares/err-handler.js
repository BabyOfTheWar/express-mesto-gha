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

  return next(err);
};

module.exports = errorHandler;
