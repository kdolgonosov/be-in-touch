const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const { PORT = 3001 } = process.env;
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
    // .connect(process.env.MONGODB_URI)
    .connect(process.env.DB_URL)
    .then(() => console.log('db is okay'))
    .catch((err) => console.log('db err', err));

app.use('/', require('./routes'));

app.listen(PORT, () => {
    console.log(`Сервер запущен на порте: ${PORT}`);
});

module.exports = app;
