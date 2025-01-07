import crypto from 'crypto';
import generarAutToken from '../middleware/generarAuthToken.js';
import { sql, conectarDB } from '../config/db.js';
import Usuario from '../models/usuario.js';
import NodeCache from "node-cache";
import autenticacionToken, {blacklistToken} from "../middleware/autenticacionToken.js";
import Estados from "../utils/Estados.js";
import jwt from "jsonwebtoken";

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
        switch (usuario.estado) {
            case Estados.INACTIVO:
                return res.status(403).send({
                    estado: usuario.estado,
                    message: 'Acceso no autorizado por usuario inactivo en el sistema.'
                });
            case Estados.PENDIENTE:
                return res.status(401).send({
                    estado: usuario.estado,
                    message: 'Usuario pendiente de verificar su correo electronico.'
                });
            case Estados.ACTIVO:
                // Encriptamos la informacion del usuario para regresarla al frontend
                const token = generarAutToken(usuario);
                res.cookie('authToken', token, { // Guardamos el token en una cookie segura
                    httpOnly: true,
                    secure: 'auto',
                    sameSite: 'none',
                    maxAge: 24*60*60*1000,
                    path: '/'
                })
                return res.status(201).send({token: token,message: 'Inicio de sesión exitoso.', rol: usuario.rol});
            default:
                return res.status(401).send('Estado desconocido del usuario.');
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

// Endpoint para verificar que el token en una cookie sea valido y guardarlo en el contexto del frontend
export const verificarToken = async (req, res) => {
    try{
        const comprobado = jwt.verify(req.cookies.authToken, process.env.JWT_SECRET);
        res.status(200).send({token: req.cookies.authToken, rol: comprobado.rol});
    } catch (err) {
        res.status(400).send({message: 'Token invalido '+ err.message});
    }
}
