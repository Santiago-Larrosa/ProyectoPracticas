import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    // --- CAMBIO: Obtenemos userType del cuerpo de la petición ---
    const { username, email, password, userType } = req.body;


    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ error: 'Ya existe un usuario con ese email' });
    }

    // --- CAMBIO: Pasamos userType al crear el nuevo usuario ---
    const user = new User({ username, email, password, userType });
    await user.save();

    // --- CAMBIO: Incluimos userType en el token JWT ---
    const token = jwt.sign(
      { id: user._id, username: user.username, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // --- CAMBIO: Devolvemos userType en la respuesta ---
    res.json({
      token,
      username: user.username,
      email: user.email,
      id: user._id.toString(),
      userType: user.userType
    });

  } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }


    if (!email || !password) {
      return res.status(400).json({ error: 'Datos de autenticación incompletos' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // --- CAMBIO: Incluimos userType en el token JWT ---
    const token = jwt.sign(
      { id: user._id, username: user.username, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    // --- CAMBIO: Devolvemos userType en la respuesta ---
    res.json({
      token,
      username: user.username,
      email: user.email,
      id: user._id.toString(),
      userType: user.userType
    });

  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

export default router;
