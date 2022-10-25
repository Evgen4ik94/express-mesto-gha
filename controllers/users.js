const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

// Создаем контроллеры для пользователей
const getUser = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail(() => {
      throw res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    })
    .then((user) => res.status(200).send(user))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequestError).send({ message: 'Передан некорректный Id' });
      }
      if (err.message === 'NotFound') {
        return res.status(NotFoundError).send({ message: 'Пользователь по указанному _id не найден' });
      }
      next(err);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw res.status(BadRequestError).send({ message: 'Переданы некорректные данные' });
      } else if (err.code === 11000) {
        return res.status(ConflictError).send({ message: `Пользователь с таким email ${req.body.email} уже существует` });
      } else {
        next(err);
      }
    });
};

// Обновление информации профиля
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true })
    .orFail(() => {
      throw res.status(NotFoundError).send({ message: 'Пользователь с указанным _id не найден' });
    })
    .then((user) => res.status(200).send(user))
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
    .then((user) => res.status(200).send(user))
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
      throw res.status(NotFoundError).send({ message: 'Пользователь не найден' });
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw res.status(BadRequestError).send({ message: 'Переданы некорректный id' });
      } else if (err.message === 'NotFound') {
        throw res.status(NotFoundError).send({ message: 'Пользователь не найден' });
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
        NODE_ENV ? JWT_SECRET : 'dev-token-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch(next);
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
