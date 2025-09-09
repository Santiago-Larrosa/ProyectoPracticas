import express from 'express';
import User from '../models/User.js';   
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
    const { search } = req.query;
    const query = {};

    if (search) {
      query.username = { $regex: search, $options: 'i' };
    }
    

    const users = await User.find(query).select('_id username');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
  }
});

export default router;

