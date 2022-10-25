const jwt = require('jsonwebtoken');

// Создаем middleware для авторизации
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'Evgeniy Miliakov');
  } catch (err) {
    throw res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
};
