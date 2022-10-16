const router = require('express').Router();

// Создаем роуты для юзеров
const {
  getUsers,
  createUser,
  getUser,
  updateAvatar,
  updateProfile,
} = require('../controllers/users');

router.get('/', getUsers); // Возвращает всех пользователей
router.get('/:userId', getUser); // Возвращает пользователя по _id
router.post('/', createUser); // Создаёт пользователя
router.patch('/me', updateProfile); // Обновляет инфо профиля
router.patch('/me/avatar', updateAvatar); // Обновляет аватар

module.exports = router;
