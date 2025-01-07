import express from 'express';
import {
    login,
    logout, verificarToken
} from '../controllers/authController.js';
import autenticacionToken from '../middleware/autenticacionToken.js';

const router = express.Router();

router.get('/',autenticacionToken, verificarToken);
router.post('/login', login);
router.post('/logout', autenticacionToken, logout);

export default router;
