const express = require('express'); // Подключаем экспресс
const mongoose = require('mongoose'); // И мангуста
const bodyParser = require('body-parser'); // Мидлвэр body-parser. Он самостоятельно объединяет все пакеты
const { createUser, login } = require('./controllers/users');
const { cardRouter } = require('./routes/cards');
const { userRouter } = require('./routes/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json()); // Для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // Для приёма веб-страниц внутри POST-запроса

// Подключаемся к серверу MongoDB по адресу:
mongoose.connect('mongodb://localhost:27017/mestodb', { // mestodb — имя базы данных, которая будет создана в MongoDB
  useNewUrlParser: true,
});
app.use(express.json());

// Временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '634848dd7c302d840461792b', // Id взято в MongoDB из бд "mestodb" в папке users, это id тестового юзера
  };

  next();
});

// РОУТЫ
app.post('/signin', login); // Роуты для логина
app.post('/signup', createUser); // и регистрации

app.use(auth); // Защищаем роуты авторизацией
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.all('*', () => {
  throw new NotFoundError('Запрашиваемая страница не найдена');
});

app.listen(PORT, () => { // Сервер слушает 3000-й порт
  console.log(`App listening on port ${PORT}`);
});
