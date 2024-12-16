const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {connectDB, sql, conectarDB} = require('./config/db');

const app = express();

// Nos conectamos a la base de datos
conectarDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Manejamos las sesiones
app.use(session({
    secret: process.env.SESSION_SECRET, // Usamos una llave segura y la guardamos en el archivo .env
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Iniciamos el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Iniciamos el servidor en ${PORT}`);
})

module.exports = app;
