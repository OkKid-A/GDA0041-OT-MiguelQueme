function verificadorOperador(req, res, next) { //middleware para permitir acceso solo  a operadores
    const user = req.user;
    //verificamos que la informacion de usuario este presente y su rol sea operador
    if (req.user && req.user.rol === 'operador') {
        return next(); //seguimos con la ejecucion
    }

    // Si no hay usuario o no es operador, enviamos solo un mensaje de error
    return res.status(403).json({ message: 'Acceso denegado, solo se permiten operadores.' });
}

module.exports = verificadorOperador;
