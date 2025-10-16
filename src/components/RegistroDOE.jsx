import { useState } from 'react';
import AlumnoDetalle from './AlumnoDetalle';
import './Chat.css';

function RegistroDOE({ onBack }) {
    const [alumnos, setAlumnos] = useState([]);
    const [nuevoAlumno, setNuevoAlumno] = useState({
        nombre: "",
        curso: "",
        fecha: "",
        dni: "",
        edad: "",
        direccion: "",
        telefono: "",
        tutor: ""
    });
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
        setNuevoAlumno({
            nombre: "", curso: "", fecha: "", dni: "",
            edad: "", direccion: "", telefono: "", tutor: ""
        });
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
                <input name="nombre" placeholder="Nombre del alumno" value={nuevoAlumno.nombre} onChange={handleChange} />
                <input name="curso" placeholder="Curso" value={nuevoAlumno.curso} onChange={handleChange} />
                <input type="date" name="fecha" value={nuevoAlumno.fecha} onChange={handleChange} />
                <input name="dni" placeholder="DNI" value={nuevoAlumno.dni} onChange={handleChange} />
                <input name="edad" placeholder="Edad" value={nuevoAlumno.edad} onChange={handleChange} />
                <input name="direccion" placeholder="Dirección" value={nuevoAlumno.direccion} onChange={handleChange} />
                <input name="telefono" placeholder="Teléfono" value={nuevoAlumno.telefono} onChange={handleChange} />
                <input name="tutor" placeholder="Tutor o responsable" value={nuevoAlumno.tutor} onChange={handleChange} />
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
