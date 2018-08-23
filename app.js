const express = require('express');
const path = require('path');
const router = require('./routes/index');
const session = require('express-session');
const app = express();

app.set('views', path.join(__dirname, 'source', 'template', 'pages'));
app.set('view engine', 'pug');

app.use(session({
    secret: 'lesson3',
    key: 'sessionkey',
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // сутки
    },
    saveUninitialized: false,
    resave: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.use(function (req, res) {
    console.log('Роут не обработан');
    res.send('404 - страница не найдена');
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
