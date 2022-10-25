const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

// Создаем роуты для юзеров
const {
  getUsers,
  getUser,
  getCurrentUser,
  updateAvatar,
  updateProfile,
} = require('../controllers/users');

router.get('/', getUsers); // Возвращает всех пользователей
router.get('/me', getCurrentUser); // Возвращает мой профиль
router.get('/:userId', getUser); // Возвращает пользователя по _id

router.patch('/me', celebrate({ // Обновляет инфо профиля
  body: Joi.object().keys({ // Валидация
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), updateProfile);

router.patch('/me/avatar', celebrate({ // Обновляет аватар
  body: Joi.object().keys({
    avatar: Joi.string().min(2),
  }),
}), updateAvatar);

module.exports.userRouter = router;
