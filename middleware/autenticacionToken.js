const jwt = require('jsonwebtoken');
const redis = require('redis');
const client = redis.createClient();
const { promisify } = require('util');
const getAsync = promisify(client.set).bind(client);

const autenticacionToken = async (req, res, next) => {
    const authHeader = req.headers['autorizador']; // Obtenemos el token del header autorizacion
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({message: 'Acceso denegado. Token no encontrado.'});
    }

    try {
        // Revisamos que el token no este en la blacklist debido a un cierre de sesion previo
        const baneado = await getAsync(token);
        if (baneado) {
            return res.status(403).json({message: 'Acceso no autorizado. Tu sesión ha finalizado.'});
        }

        // Verificamos el token con una llave segura guardada en un archivo .env
        const descifrado = jwt.verify(token, process.env.JWT_SECRET);
        req.user = descifrado.user;
        next();
    } catch (err) {
        res.status(403).json({message: 'Token invalido.'});
    }
};

module.exports = autenticacionToken;
