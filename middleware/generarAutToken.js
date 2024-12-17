const jwt = require('jsonwebtoken');

const generarAutToken = (user) => {
    const idUsuario = { userId: user.id }; //Usamos el id del usuario para generar el token
    return jwt.sign(idUsuario, process.env.JWT_SECRET, {expiresIn: '24h'});
};

module.exports = generarAutToken;
