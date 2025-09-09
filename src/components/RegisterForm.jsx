import React, { useState } from 'react';
import './AuthForms.css';


const RegisterForm = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('alumno'); // Estado para el tipo de usuario
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', { // Asegúrate que la URL sea la correcta
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, userType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }
      
      onRegister(data); // Pasamos todos los datos del usuario al App.jsx

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto' }}>
      <h2>Registro</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{ marginBottom: '10px', padding: '8px' }}
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ marginBottom: '10px', padding: '8px' }}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ marginBottom: '10px', padding: '8px' }}
      />
      {/* Menú desplegable para seleccionar el tipo de usuario */}
      <select 
        value={userType} 
        onChange={(e) => setUserType(e.target.value)}
        required
        style={{ marginBottom: '10px', padding: '8px' }}
      >
        <option value="alumno">Alumno</option>
        <option value="profesor">Profesor</option>
        <option value="preceptor">Preceptor</option>
      </select>
      <button type="submit" disabled={loading} style={{ padding: '10px' }}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  );
};

export default RegisterForm;
