const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {connectDB, sql, conectarDB} = require('./config/db');
const autenticacionToken = require('./middleware/autenticacionToken');
const generarAutToken = require('./middleware/generarAutToken');
require('dotenv').config();

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
    secret: process.env.SESSION_SECRET, // Usamos una llave segura guardada en un archivo .env
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));

// Endpoint para iniciar sesion y retornar un token
app.post('/login', (req, res) => {
    const user = { id: 1, name: 'John Doe' }; // Replace with actual user verification logic
    const token = generarAutToken(user);
    // El token se retorna para ser almacenado en el frontend
    res.json({token})
});

// Iniciamos el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Iniciamos el servidor en ${PORT}`);
});

module.exports = app;
