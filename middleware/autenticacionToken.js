const jwt = require('jsonwebtoken');

const autenticacionToken = (req, res, next) => {
    const authHeader = req.headers['autorizador']; // Obtenemos el token del header autorizacion
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no encontrado.' });
    }

    try {
        // Verificamos el token con una llave segura guardada en un archivo .env
        const descifrado = jwt.verify(token, process.env.JWT_SECRET);
        req.user = descifrado;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Token invalido..' });
    }
};

module.exports = autenticacionToken;
