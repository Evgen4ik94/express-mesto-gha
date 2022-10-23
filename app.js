const express = require('express'); // Подключаем экспресс
const mongoose = require('mongoose'); // И мангуста
const bodyParser = require('body-parser'); // Мидлвэр body-parser. Он самостоятельно объединяет все пакеты
const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json()); // Для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // Для приёма веб-страниц внутри POST-запроса

// Подключаемся к серверу MongoDB по адресу:
mongoose.connect('mongodb://localhost:27017/mestodb', { // mestodb — имя базы данных, которая будет создана в MongoDB
  useNewUrlParser: true,
});

// Временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '634848dd7c302d840461792b', // Id взято в MongoDB из бд "mestodb" в папке users, это id тестового юзера
  };

  next();
});

// РОУТЫ
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.post('/signin', login);
app.post('/signup', createUser);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Неправильный путь' });
});

app.listen(PORT, () => { // Сервер слушает 3000-й порт
  console.log(`App listening on port ${PORT}`);
});
