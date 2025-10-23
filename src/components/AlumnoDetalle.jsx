import { useState } from 'react';
import ObservacionDetalle from './ObservacionDetalle';

function AlumnoDetalle({ alumno, onBack, onUpdate }) {
    const [observaciones, setObservaciones] = useState(alumno.observaciones || []);
    const [nuevaObs, setNuevaObs] = useState({ titulo: "", texto: "" });
    const [obsSeleccionada, setObsSeleccionada] = useState(null);

    const handleAgregarObs = async (e) => {
        e.preventDefault();
        if (!nuevaObs.titulo.trim() || !nuevaObs.texto.trim()) return;

        try {
            const res = await fetch(`/api/alumnos/${alumno._id}/observaciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaObs)
            });

            const actualizado = await res.json();
            setObservaciones(actualizado.observaciones);
            setNuevaObs({ titulo: "", texto: "" });
            onUpdate(actualizado);
        } catch (err) {
            console.error('Error al agregar observación:', err);
        }
    };

    if (obsSeleccionada) {
        return (
            <ObservacionDetalle
                observacion={obsSeleccionada}
                onBack={() => setObsSeleccionada(null)}
            />
        );
    }

    return (
        <div className="detalle-container">
            <h2>Registro de {alumno.nombre}</h2>
            <p><strong>Curso:</strong> {alumno.curso}</p>
            <p><strong>Fecha de ingreso:</strong> {alumno.fecha}</p>
            <p><strong>DNI:</strong> {alumno.dni}</p>
            <p><strong>Edad:</strong> {alumno.edad}</p>
            <p><strong>Dirección:</strong> {alumno.direccion}</p>
            <p><strong>Teléfono:</strong> {alumno.telefono}</p>
            <p><strong>Tutor:</strong> {alumno.tutor}</p>

            <button onClick={onBack}>Volver a la lista</button>

            <h3>Observaciones</h3>
            <ul>
                {observaciones.map((obs) => (
                    <li key={obs._id}>
                        <strong>{obs.titulo}</strong> ({obs.fecha})
                        <button onClick={() => setObsSeleccionada(obs)}>Ver</button>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleAgregarObs}>
                <input
                    type="text"
                    placeholder="Título de la observación"
                    value={nuevaObs.titulo}
                    onChange={(e) => setNuevaObs({ ...nuevaObs, titulo: e.target.value })}
                />
                <textarea
                    placeholder="Escribe el texto de la observación..."
                    value={nuevaObs.texto}
                    onChange={(e) => setNuevaObs({ ...nuevaObs, texto: e.target.value })}
                />
                <button type="submit">Agregar observación</button>
            </form>
        </div>
    );
}

export default AlumnoDetalle;
