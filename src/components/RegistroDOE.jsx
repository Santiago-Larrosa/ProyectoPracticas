import { useState } from 'react';
import AlumnoDetalle from './AlumnoDetalle';
import './Chat.css';

function RegistroDOE({ onBack }) {
    const [alumnos, setAlumnos] = useState([
        {
            id: 1, nombre: "Juan Pérez", curso: "3°A", fecha: "2025-03-10", observaciones: [
                { id: 1, texto: "Problemas de concentración en clase" },
                { id: 2, texto: "Se reunió con orientador el 15/03" }
            ]
        },
        {
            id: 2, nombre: "María Gómez", curso: "2°B", fecha: "2025-04-22", observaciones: [
                { id: 1, texto: "Alto rendimiento académico" }
            ]
        },
    ]);

    const [nuevoAlumno, setNuevoAlumno] = useState({ nombre: "", curso: "", fecha: "" });
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);

    const handleChange = (e) => {
        setNuevoAlumno({ ...nuevoAlumno, [e.target.name]: e.target.value });
    };

    const handleAgregar = (e) => {
        e.preventDefault();
        if (!nuevoAlumno.nombre || !nuevoAlumno.curso) return;

        setAlumnos([
            ...alumnos,
            { id: Date.now(), ...nuevoAlumno, observaciones: [] }
        ]);
        setNuevoAlumno({ nombre: "", curso: "", fecha: "" });
    };

    const handleAbrirAlumno = (alumno) => {
        setAlumnoSeleccionado(alumno);
    };

    const handleActualizarAlumno = (alumnoActualizado) => {
        setAlumnos(alumnos.map(a => a.id === alumnoActualizado.id ? alumnoActualizado : a));
        setAlumnoSeleccionado(alumnoActualizado);
    };

    if (alumnoSeleccionado) {
        return (
            <AlumnoDetalle
                alumno={alumnoSeleccionado}
                onBack={() => setAlumnoSeleccionado(null)}
                onUpdate={handleActualizarAlumno}
            />
        );
    }

    return (
        <div className="registro-container">
            <h2>Registro DOE</h2>
            <button onClick={onBack}>Volver</button>

            <form onSubmit={handleAgregar} className="registro-form">
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre del alumno"
                    value={nuevoAlumno.nombre}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="curso"
                    placeholder="Curso"
                    value={nuevoAlumno.curso}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="fecha"
                    value={nuevoAlumno.fecha}
                    onChange={handleChange}
                />
                <button type="submit">Agregar Alumno</button>
            </form>

            <h3>Lista de alumnos</h3>
            <ul className="registro-lista">
                {alumnos.map((a) => (
                    <li key={a.id}>
                        <strong>{a.nombre}</strong> ({a.curso}) - {a.fecha}
                        <button onClick={() => handleAbrirAlumno(a)}>Ver registro</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RegistroDOE;
