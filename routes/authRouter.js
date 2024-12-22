import express from 'express';
import {
    login,
    logout
} from '../controllers/authController.js';
import autenticacionToken from '../middleware/autenticacionToken.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', autenticacionToken, logout);

export default router;
