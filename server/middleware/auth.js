import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // formato "Bearer <token>"
  if (!token) return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}
