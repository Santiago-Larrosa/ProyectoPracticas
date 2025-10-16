function ObservacionDetalle({ observacion, onBack }) {
    return (
        <div className="observacion-detalle">
            <h2>{observacion.titulo}</h2>
            <p><strong>Fecha:</strong> {observacion.fecha}</p>
            <p>{observacion.texto}</p>
            <button onClick={onBack}>Volver</button>
        </div>
    );
}

export default ObservacionDetalle;
