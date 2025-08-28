import express from 'express';
import Message from '../models/Message.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();


const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acceso no autorizado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = decoded; // req.user ahora tiene { id, username, userType }
    next();
  });
};

router.get('/:chatType', authenticate, async (req, res) => {
  try {
    const { chatType } = req.params;
    const { userType } = req.user;

    // --- CAMBIO: Lógica de permisos ---
    const allowedChats = {
      alumno: ['general', 'alumnos'],
      profesor: ['general', 'alumnos', 'profesores'],
      preceptor: ['general', 'alumnos', 'profesores', 'preceptores'],
    };

    // Verificamos si el usuario tiene permiso para acceder al chat solicitado
    if (!allowedChats[userType] || !allowedChats[userType].includes(chatType)) {
      return res.status(403).json({ error: 'Acceso denegado a este chat' });
    }
    // --- Fin del cambio ---

    let query = {};

    if (chatType === 'general') {
      query = {
        $or: [
          { chatType: 'general' },
          { chatType: { $exists: false } }
        ]
      };
    } else {
      query = { chatType };
    }

    const messages = await Message.find(query).sort({ createdAt: 1 });
    res.json(messages);

  } catch (err) {
    console.error("Error al cargar mensajes:", err);
    res.status(500).json({ error: 'Error al cargar mensajes' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { author, content, userType, chatType } = req.body;
    if (!author || !content || !userType || !chatType) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const newMessage = new Message({ author, content, userType, chatType });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error al guardar mensaje:", err);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});


router.delete('/:id', authenticate, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Mensaje no encontrado' });
    }
    
    await message.deleteOne();
    res.json({ message: 'Mensaje eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar mensaje' });
  }
});

export default router;
