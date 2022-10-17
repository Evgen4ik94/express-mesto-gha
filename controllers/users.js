const User = require('../models/user');

const { DefaultError, NotFoundError, BadRequestError } = require('../app');

// Создаем контроллеры для пользователей
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NotFoundError).send({ message: 'Пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequestError).send({ message: 'Передан некорректный Id' });
      }
      return res.status(DefaultError).send({ message: 'Произошла ошибка' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(DefaultError).send({ message: 'Произошла ошибка' }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequestError).send({ message: 'Введены некорректные данные' });
      }
    })
    .catch(() => res.status(DefaultError).send({ message: 'Произошла ошибка' }));
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send({
      _id: user._id, avatar: user.avatar, name, about,
    }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequestError).send({ message: 'Введены некорректные данные' });
      }
    })
    .catch(() => res.status(DefaultError).send({ message: 'Произошла ошибка' }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send({
      _id: user._id, avatar, name: user.name, about: user.about,
    }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequestError).send({ message: 'Введены некорректные данные' });
      }
    })
    .catch(() => res.status(DefaultError).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateProfile,
  updateAvatar,
};
