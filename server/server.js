import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import alumnosRoutes from './routes/alumnos.js';
app.use('/api/alumnos', alumnosRoutes);

dotenv.config();


const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`❌ ${varName} no está definida en .env`);
  }
});


const app = express();
app.use(express.json());


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error(' Error de conexión a MongoDB:', err.message);
    process.exit(1); 
  }
};

mongoose.connection.on('connected', () => {
  console.log('Conexión a MongoDB establecida');
});

mongoose.connection.on('error', (err) => {
  console.error(' Error en conexión MongoDB:', err);
});


app.use('/api/auth', (req, res, next) => {
  console.log(`[AUTH ROUTE] ${req.method} ${req.originalUrl}`);
  next();
});
app.use('/api/auth', authRoutes); 

app.use('/api/messages', messageRoutes);
  
app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(' Error:', err.stack);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
    console.log(` Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  });
};

startServer();