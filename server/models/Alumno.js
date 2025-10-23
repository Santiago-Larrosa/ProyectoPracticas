import mongoose from 'mongoose';

const observacionSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    texto: { type: String, required: true },
    fecha: { type: String, required: true },
});

const alumnoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    curso: { type: String, required: true },
    fecha: { type: String },
    dni: { type: String },
    edad: { type: String },
    direccion: { type: String },
    telefono: { type: String },
    tutor: { type: String },
    observaciones: [observacionSchema]
});

const Alumno = mongoose.models.Alumno || mongoose.model('Alumno', alumnoSchema);
export default Alumno;
