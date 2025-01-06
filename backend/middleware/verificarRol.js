// Middleware mejorado para permitir a uno o mas usados dinamicamente
const verificarRol = (...roles) => (req, res, next) => {
    const user = req.user;

    // Verificamos que la informacion de usuario este presente y su rol este en la lista
    if (req.user && roles.includes(req.user.rol)) {
        return next(); // Seguimos con la ejecucion
    }

    // Si no hay usuario o su rol no esta en la lista, enviamos solo un mensaje de error
    return res.status(403).json({ message: 'Acceso denegado por tu rol.'});
}

export default verificarRol;