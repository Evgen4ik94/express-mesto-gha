const express = require('express'); // Подключаем экспресс
const mongoose = require('mongoose'); // И мангуста
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const { cardRouter } = require('./routes/cards');
const { userRouter } = require('./routes/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const { validateCreateUser, validateLogin } = require('./utils/utils');

const { PORT = 3000 } = process.env;

const app = express();

// Подключаемся к серверу MongoDB по адресу:
mongoose.connect('mongodb://localhost:27017/mestodb', { // mestodb — имя базы данных, которая будет создана в MongoDB
  useNewUrlParser: true,
});
app.use(express.json());

// РОУТЫ
app.post('/signin', validateLogin, login); // Роуты для логина
app.post('/signup', validateCreateUser, createUser); // и регистрации

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.all('*', () => {
  throw new NotFoundError({ message: 'Запрашиваемая страница не найдена' });
});
app.use(errors());

app.listen(PORT, () => { // Сервер слушает 3000-й порт
  console.log(`App listening on port ${PORT}`);
});
