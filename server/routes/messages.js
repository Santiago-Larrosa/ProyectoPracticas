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
    req.user = decoded;
    next();
  });
};

router.get('/', authenticate, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Error al cargar mensajes' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { author, content } = req.body;
    if (!author || !content) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const newMessage = new Message({ author, content });
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

    if (message.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este mensaje' });
    }

    await message.deleteOne();
    res.json({ message: 'Mensaje eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar mensaje' });
  }
});

export default router;
