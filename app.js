const express = require('express'); // Подключаем экспресс
const mongoose = require('mongoose'); // И мангуста
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const { cardRouter } = require('./routes/cards');
const { userRouter } = require('./routes/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const { validateCreateUser, validateLogin } = require('./utils/utils');

const { PORT = 3000 } = process.env;

const app = express();
app.use(cookieParser());

// Подключаемся к серверу MongoDB по адресу:
mongoose.connect('mongodb://localhost:27017/mestodb', { // mestodb — имя базы данных, которая будет создана в MongoDB
  useNewUrlParser: true,
});
app.use(express.json());

// РОУТЫ
app.post('/signin', validateLogin, login); // Роуты для логина
app.post('/signup', validateCreateUser, createUser); // и регистрации

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use(errors());

app.all('*', () => {
  throw NotFoundError({ message: 'Запрашиваемая страница не найдена' });
});

app.listen(PORT, () => { // Сервер слушает 3000-й порт
  console.log(`App listening on port ${PORT}`);
});
