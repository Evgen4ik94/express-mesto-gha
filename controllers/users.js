const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { // Создаем и экспортируем в контроллеры константы ошибок
  NotFoundError,
  BadRequestError,
  AuthError,
  ConflictError,
} = require('../errors/errors');

// Создаем контроллеры для пользователей
const getUser = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail(() => {
      throw res.status(NotFoundError).send({ message: 'Пользователь по указанному id не найден' });
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(res.status(BadRequestError).send({ message: 'Переданы некорректные данные' }));
      }
      if (err.message === 'NotFound') {
        next(res.status(NotFoundError).send({ message: 'Пользователь по указанному id не найден' }));
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw res.status(ConflictError).send({ message: 'Пользователь с данным email уже существует' });
      } return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((newUser) => {
      if (!newUser) {
        return next(res.status(NotFoundError).send({ message: 'Объект не найден' }));
      }
      return res.send({
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
        _id: newUser._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(res.status(BadRequestError).send({ message: 'Введены ны некорректные данные' }));
      } next(err);
    });
};

// Обновление информации профиля
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true })
    .orFail(() => {
      throw res.status(NotFoundError).send({ message: 'Пользователь с указанным _id не найден' });
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw res.status(BadRequestError).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true })
    .orFail(() => {
      throw res.status(NotFoundError).send({ message: 'Пользователь с указанным _id не найден' });
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw res.status(BadRequestError).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw res.send(NotFoundError)({ message: 'Пользователь не найден' });
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw res.status(BadRequestError).send({ message: 'Переданы некорректный id' });
      } else if (err.message === 'NotFound') {
        next(res.status(NotFoundError).send({ message: 'Пользователь не найден' }));
      } else {
        next(err);
      }
    });
};

// Создание контроллера login
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-token-secret',
        'super-token-secret',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(() => {
      next(res.status(AuthError).send({ message: 'Неверные почта или пароль' }));
    });
};

module.exports = {
  getUser,
  getUsers,
  getCurrentUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
