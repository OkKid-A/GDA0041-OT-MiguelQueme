const crypto = require('crypto');
const generarAutToken = require("../middleware/generarAuthToken");
const {sql, conectarDB} = require("../config/db");
const redis = require('redis');
const client = redis.createClient();
const { promisify } = require('util');
const setAsync = promisify(client.set).bind(client);
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

// Enpoint para verificar la informacion de un usuario y crear un token valido si es correcta
exports.login = async (req, res) => {
    const {correo, password} = req.body;
    // Encriptamos la contraseña en sha256 antes de enviarla al frontend
    const hash = crypto.createHash('sha256');
    hash.update(password);
    const passEncriptada = hash.digest('hex');

    try {
        const pool = await conectarDB();

        const usuario = await Usuario.loginUsuario(correo, passEncriptada, pool);

        if (usuario) {
            res.status(401).send('Credenciales incorrectas')
        }

        // Confirmamos que el estado del usuario sea activo
        switch (usuario.estado.toLowerCase()) {
            case 'inactivo':
                return res.status(403).send({
                    estado: usuario.estado, message: 'Acceso no autorizado por usuario ' +
                        'inactivo en el sistema.'
                });
            case 'pendiente':
                return res.status(401).send({
                    estado: usuario.estado, message: 'Usuario pendiente de verificar ' +
                        'su correo electronico.'
                });
            case 'activo':
                // Encriptamos la informacion del usuario para regresarla al frontend
                const token = generarAutToken(usuario);
                return res.status(201).send({auth: token, message: 'Inicio de sesión exitoso.'});
            default:
                return res.status(500).send('Estado desconocido del usuario.');
        }

    } catch (err) {
        res.status(500).send('Error al iniciar sesión: '+err.message);
    }
};

// Endpoint para cerrar sesion en la api para mayor seguridad
exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers['autorizador']; // Obtenemos el token del header autorizacion
        const token = authHeader && authHeader.split(' ')[1];
        const descifrado = jwt.verify(token, process.env.JWT_SECRET);
        const userId = descifrado.user.id_usuario;

        // Guardamos el token en una blacklist por el resto de su existencia
        await setAsync(token, userId, 'EX', descifrado.exp - Math.floor(Date.now() / 1000));

        res.status(200).send({ message: 'Se cerro la sesion con exito.' });
    } catch (err) {
        res.status(500).send({ message: 'Error al intentar cerrar la sesion: ' + err.message });
    }
};

