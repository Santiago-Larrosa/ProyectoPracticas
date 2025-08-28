// src/components/Informe.jsx
import React, { useRef } from 'react';
import './informe.component.css';

function Informe({ onBack }) {
  const containerRef = useRef();

  const imprimirInforme = () => {
    window.print();
  };

  return (
    <div ref={containerRef} className="container">
      <h1>INFORME DE CONVIVENCIA</h1>
      <p>Gobierno de la Ciudad Autónoma de Buenos Aires<br />
        Ministerio de Educación<br />
        E.T. Nº 35 D.E. 18, "Ing. Eduardo Latizna"</p>

      <div className="form-group">
        <label>1.- El alumno/a:</label>
        <div className="inline-group">
          <input type="text" className="input-line" placeholder="Nombre del alumno/a" />
          <input type="text" className="input-line" placeholder="Año" />
          <input type="text" className="input-line" placeholder="División" />
        </div>
      </div>

      <div className="form-group">
        <label>2.- Ha realizado la acción que se describe a continuación:</label>
        <input type="text" className="input-line" />
      </div>

      <div className="form-group">
        <label>Transgrediendo Normas del Reglamento de Convivencia de la escuela.</label>
      </div>

      <div className="form-group">
        <label>3.- Solicitud de sanción:</label>
        <input type="text" className="input-line" placeholder="Descripción de la sanción" />
      </div>

      <div className="form-group">
        <label>Docente:</label>
        <div className="inline-group">
          <input type="text" className="input-line" placeholder="Nombre del docente" />
          <input type="text" className="input-line" placeholder="Cargo/Función" />
          <input type="text" className="input-line" placeholder="Fecha" />
          <input type="text" className="input-line" placeholder="Firma" />
        </div>
      </div>

      <div className="form-group">
        <label>4.- Descargo del Alumno/a:</label>
        <input type="text" className="input-line" />
      </div>

      <div className="form-group">
        <label>5.- Informe de Consejo de Aula:</label>
        <input type="text" className="input-line" />
      </div>

      <div className="form-group">
        <label>6.- Informe de Consejo de Convivencia:</label>
        <input type="text" className="input-line" />
      </div>

      <div className="form-group">
        <label>7.- Observaciones:</label>
        <input type="text" className="input-line" />
      </div>

      <div className="form-group">
        <label>8.- Se considera que corresponde (Indicar a continuación):</label>
        <div className="inline-checks">
          <label><input type="radio" name="instancia" /> 1ª Instancia LEVE</label>
          <label><input type="radio" name="instancia" /> 2ª Instancia GRAVE</label>
          <label><input type="radio" name="instancia" /> 3ª Instancia MUY GRAVE</label>
        </div>
      </div>

      <div className="form-group">
        <label>Otra Consideración:</label>
        <input type="text" className="input-line" />
      </div>

      <div className="form-group">
        <label>Firma Directivo:</label>
        <input type="text" className="input-line small-input" />
        <label>Fecha:</label>
        <input type="text" className="input-line small-input" />
      </div>

      <div className="form-group">
        <label>9.- Notificación:</label>
        <label>Alumno:</label>
        <input type="text" className="input-line small-input" />
        <label>Padre/Madre/Tutor:</label>
        <input type="text" className="input-line small-input" />
        <label>Fecha:</label>
        <input type="text" className="input-line small-input" />
      </div>

      <div className="button-container">
        <button className="print-button" onClick={imprimirInforme}>Imprimir</button>
      </div>

      <div className="button-back">
        <button onClick={onBack}>VOLVER AL MENÚ</button> 
      </div>
    </div>
  );
}

export default Informe;
