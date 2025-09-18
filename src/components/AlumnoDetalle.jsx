import { useState } from 'react';

function AlumnoDetalle({ alumno, onBack, onUpdate }) {
    const [observaciones, setObservaciones] = useState(alumno.observaciones || []);
    const [nuevaObs, setNuevaObs] = useState("");

    const handleAgregarObs = (e) => {
        e.preventDefault();
        if (!nuevaObs.trim()) return;

        const nueva = { id: Date.now(), texto: nuevaObs };
        const actualizado = { ...alumno, observaciones: [...observaciones, nueva] };

        setObservaciones(actualizado.observaciones);
        setNuevaObs("");
        onUpdate(actualizado);
    };

    return (
        <div className="detalle-container">
            <h2>Registro de {alumno.nombre}</h2>
            <p><strong>Curso:</strong> {alumno.curso}</p>
            <p><strong>Fecha de ingreso:</strong> {alumno.fecha}</p>

            <button onClick={onBack}>Volver a la lista</button>

            <h3>Observaciones</h3>
            <ul>
                {observaciones.map((obs) => (
                    <li key={obs.id}>{obs.texto}</li>
                ))}
            </ul>

            <form onSubmit={handleAgregarObs}>
                <textarea
                    value={nuevaObs}
                    onChange={(e) => setNuevaObs(e.target.value)}
                    placeholder="Escribe una nueva observación..."
                />
                <button type="submit">Agregar observación</button>
            </form>
        </div>
    );
}

export default AlumnoDetalle;
