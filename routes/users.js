const router = require('express').Router();

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
router.patch('/me', updateProfile); // Обновляет инфо профиля
router.patch('/me/avatar', updateAvatar); // Обновляет аватар

module.exports.userRouter = router;
