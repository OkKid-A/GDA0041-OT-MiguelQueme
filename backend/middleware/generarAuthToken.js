import jwt from 'jsonwebtoken';

const generarAuthToken = (user) => {
    const usuario = {
        id_usuario: user.id_usuario,
        rol: user.id_rol,
        cliente: user.id_cliente,
        estado: user.id_estado,
    }; //Usamos la informacion del usuario para generar el token
    return jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: '24h' });
};

export default generarAuthToken;
