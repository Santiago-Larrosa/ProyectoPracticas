import express from 'express';
import Alumno from '../models/Alumno.js';
const router = express.Router();

// Obtener todos los alumnos
router.get('/', async (req, res) => {
    try {
        const alumnos = await Alumno.find();
        res.json(alumnos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener alumnos' });
    }
});

// Crear un nuevo alumno
router.post('/', async (req, res) => {
    try {
        const nuevoAlumno = new Alumno(req.body);
        await nuevoAlumno.save();
        res.status(201).json(nuevoAlumno);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear alumno' });
    }
});

// Agregar observación a un alumno
router.post('/:id/observaciones', async (req, res) => {
    try {
        const alumno = await Alumno.findById(req.params.id);
        if (!alumno) return res.status(404).json({ error: 'Alumno no encontrado' });

        const nuevaObs = {
            titulo: req.body.titulo,
            texto: req.body.texto,
            fecha: new Date().toISOString().split('T')[0]
        };

        alumno.observaciones.push(nuevaObs);
        await alumno.save();

        res.json(alumno);
    } catch (err) {
        res.status(500).json({ error: 'Error al agregar observación' });
    }
});

export default router;
