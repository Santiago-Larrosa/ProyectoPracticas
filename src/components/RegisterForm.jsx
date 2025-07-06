import { useState } from 'react';
import { registerUser } from '../api';
import styles from './RegisterForm.module.css';

function RegisterForm({ onRegister }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // En tu componente RegisterForm
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en registro');
      }
  
      const userData = await response.json();
      onRegister(userData);
    } catch (error) {
      console.error('Registration error:', error);
      alert(`Error: ${error.message}`);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
    <h2 className={styles.title}>Registrarse</h2>
    <input
      type="email"
      placeholder="Correo"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      className={styles.input}
    />
    <input
      type="text"
      placeholder="Nombre de usuario"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
      className={styles.input}
    />
    <input
      type="password"
      placeholder="Contraseña"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className={styles.input}
    />
    <button type="submit" className={styles.button}>Registrarse</button>
  </form>
  );
}

export default RegisterForm;
