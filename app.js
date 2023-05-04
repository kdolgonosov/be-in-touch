const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3001 } = process.env;
// const { DB_URL } = process.env;
const app = express();
// app.use(cors());
// app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
    .connect(
        'mongodb+srv://admin:admin@be-in-touch.skwcigu.mongodb.net/?retryWrites=true&w=majority',
    )
    .then(() => console.log('db is okay'))
    .catch((err) => console.log('db err', err));

// app.use(requestLogger);
// app.get('/', (req, res) => {
//     res.send('Express on Vercel');
// });
app.use('/', require('./routes'));

// app.use(errorLogger);
// app.use(errors());
// app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Сервер запущен на порте: ${PORT}`);
});

module.exports = app;
