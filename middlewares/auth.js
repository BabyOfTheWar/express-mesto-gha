const jwt = require('jsonwebtoken');

const JWT_SECRET = '123123123';

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    req.user = payload;
    return next();
  });
  return undefined;
};
