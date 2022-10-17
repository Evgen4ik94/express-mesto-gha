const Card = require('../models/card');

const { DefaultError, NotFoundError, BadRequestError } = require('../app');

// Создаем контроллеры для карточек
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(DefaultError).send('Произошла ошибка'));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequestError).send('Передан некорректный Id');
      }
    })
    .catch(() => res.status(DefaultError).send('Произошла ошибка'));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NotFoundError).send('Карточки не существует');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequestError).send('Некорректный id карточки');
      }
      return res.status(DefaultError).send('Произошла ошибка');
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((like) => {
      if (!like) {
        return res.status(NotFoundError).send('Переданный id не найден');
      }
      res.send({ data: like });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequestError).send('Некорректный id карточки');
      }
    })
    .catch(() => res.status(DefaultError).send('Произошла ошибка'));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((like) => {
      if (!like) {
        return res.status(NotFoundError).send('Переданный id не найден');
      }
      res.send({ data: like });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequestError).send('Некорректный id карточки');
      }
    })
    .catch(() => res.status(DefaultError).send('Произошла ошибка'));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
