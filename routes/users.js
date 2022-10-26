const router = require('express').Router();
const {
  validateUpdateUser,
  validateUpdateAvatar,
  validateUserId,
} = require('../utils/utils');

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
router.get('/:userId', validateUserId, getUser); // Возвращает пользователя по _id

router.patch('/me', validateUpdateUser, updateProfile);

router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports.userRouter = router;
