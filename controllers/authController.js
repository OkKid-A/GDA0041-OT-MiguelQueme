import crypto from 'crypto';
import generarAutToken from '../middleware/generarAuthToken.js';
import { sql, conectarDB } from '../config/db.js';
import Usuario from '../models/usuario.js';
import NodeCache from "node-cache";
import autenticacionToken, {blacklistToken} from "../middleware/autenticacionToken.js";

// Enpoint para verificar la informacion de un usuario y crear un token valido si es correcta
export const login = async (req, res) => {
    const { correo, password } = req.body;
    // Encriptamos la contraseña en sha256 antes de enviarla al frontend
    const hash = crypto.createHash('sha256');
    hash.update(password);
    const passEncriptada = hash.digest('hex');

    try {
        const pool = await conectarDB();

        const usuario = await Usuario.loginUsuario(correo, passEncriptada, pool);

        if (!usuario) {
            return res.status(401).send('Credenciales incorrectas');
        }

        // Confirmamos que el estado del usuario sea activo
        switch (usuario.estado.toLowerCase()) {
            case 'inactivo':
                return res.status(403).send({
                    estado: usuario.estado,
                    message: 'Acceso no autorizado por usuario inactivo en el sistema.'
                });
            case 'pendiente':
                return res.status(401).send({
                    estado: usuario.estado,
                    message: 'Usuario pendiente de verificar su correo electronico.'
                });
            case 'activo':
                // Encriptamos la informacion del usuario para regresarla al frontend
                const token = generarAutToken(usuario);
                return res.status(201).send({ auth: token, message: 'Inicio de sesión exitoso.' });
            default:
                return res.status(500).send('Estado desconocido del usuario.');
        }
    } catch (err) {
        res.status(500).send('Error al iniciar sesión: ' + err.message);
    }
};

// Endpoint para cerrar sesion en la api para mayor seguridad
export const logout = async (req, res) => {
    try {
        const authHeader = req.headers['autorizador']; // Obtenemos el token del header autorizador
        const token = authHeader && authHeader.split(' ')[1];

        // Guardamos el token en una blacklist por el resto de su existencia
        blacklistToken(token)
        res.status(200).send({ message: 'Se cerro la sesion con exito.' });
    } catch (err) {
        res.status(500).send({ message: 'Error al intentar cerrar la sesion: ' + err.message });
    }
};
