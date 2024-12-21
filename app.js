const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {connectDB, sql, conectarDB} = require('./config/db');
const autenticacionToken = require('./middleware/autenticacionToken');
const generarAutToken = require('./middleware/generarAuthToken');
require('dotenv').config();

const app = express();

// Instanciamos Routers
const categoriasRouter = require('./routes/categoriasRouter');
const productosRouter = require('./routes/productosRouter');
const estadosRouter = require('./routes/estadosRouter');
const authRouter = require('./routes/authRouter');
const usuariosRouter = require('./routes/usuariosRouter');
const clientesRouter = require('./routes/clientesRouter');
const ordenesRouter = require('./routes/ordenesRouter');

// Nos conectamos a la base de datos
conectarDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Nombramos rutas
app.use('/categorias',categoriasRouter);
app.use('/productos',productosRouter);
app.use('/estados',estadosRouter);
app.use('/auth',authRouter);
app.use('/usuarios',usuariosRouter);
app.use('/clientes',clientesRouter);
app.use('/ordenes',productosRouter);

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Iniciamos el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Iniciamos el servidor en ${PORT}`);
});

module.exports = app;
