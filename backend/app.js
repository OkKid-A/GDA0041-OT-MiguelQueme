import express from 'express';
import session from 'express-session';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { sql, conectarDB } from './config/db.js';
import dotenv from 'dotenv';
import createError from 'http-errors';
dotenv.config();

import categoriasRouter from './routes/categoriasRouter.js';
import productosRouter from './routes/productosRouter.js';
import estadosRouter from './routes/estadosRouter.js';
import authRouter from './routes/authRouter.js';
import usuariosRouter from './routes/usuariosRouter.js';
import clientesRouter from './routes/clientesRouter.js';
import ordenesRouter from './routes/ordenesRouter.js';
import autenticacionToken from "./middleware/autenticacionToken.js";
import verificarRol from "./middleware/verificarRol.js";
import Roles from "./utils/Roles.js";
import router from "./routes/productosRouter.js";

const app = express();

// Connect to the database
await conectarDB().catch(err => {
    console.error('Error en la conexión a la base de datos:', err);
    process.exit(1);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.dirname(''), 'public')));
app.use(cookieParser());
app.use(cors({
    origin: 'http://127.0.0.1:5173',
    credentials: true
}));

// Define routes
app.use('/categorias', categoriasRouter);
app.use('/productos', productosRouter);
app.use('/estados', estadosRouter);
app.use('/auth', authRouter);
app.use('/usuarios', usuariosRouter);
app.use('/clientes', clientesRouter);
app.use('/ordenes', ordenesRouter);


// Handle sessions
app.use(session({
    secret: process.env.SESSION_SECRET, // Secure key from .env file
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.json({
        message: res.locals.message,
        error: res.locals.error
    });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

export default app;
