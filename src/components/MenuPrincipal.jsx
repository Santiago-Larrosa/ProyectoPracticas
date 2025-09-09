  import React, {useState, useEffect } from 'react';
  import { getAllUsers } from '/src/api.js'; 
  import './MenuPrincipal.css'; 

  const MenuPrincipal = ({ user, onNavigate, onLogout }) => {
    // --- CAMBIO: Nuevos estados para la búsqueda ---
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // Para guardar el objeto del usuario seleccionado
    const [error, setError] = useState('');

    // --- CAMBIO: useEffect para buscar usuarios dinámicamente ---
    useEffect(() => {
      // Si el campo de búsqueda está vacío, no mostramos resultados.
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      // Usamos un temporizador para no sobrecargar el servidor con peticiones.
      // Solo se buscará 500ms después de que el usuario deje de teclear.
      const delayDebounceFn = setTimeout(() => {
        if (user?.token) {
          getAllUsers(user.token, searchTerm)
            .then(data => {
              // Filtramos al propio usuario de la lista
              const otherUsers = data.filter(u => u._id !== user.id);
              setSearchResults(otherUsers);
              setError('');
            })
            .catch((err) => {
              setError(`Error al buscar usuarios: ${err.message}`);
            });
        }
      }, 500);

      // Se limpia el temporizador si el usuario sigue escribiendo.
      return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, user]);

    // Función para manejar la selección de un usuario de la lista de resultados
    const handleSelectUser = (userToSelect) => {
      setSelectedUser(userToSelect);
      setSearchTerm(userToSelect.username); // Ponemos el nombre en el input para confirmar la selección
      setSearchResults([]); // Ocultamos la lista de resultados
    };

    const handlePrivateChat = () => {
      if (!selectedUser) {
        alert('Por favor, busca y selecciona un usuario válido para chatear.');
        return;
      }
      // Creamos el ID de la sala de chat privada
      const chatRoomId = [user.id, selectedUser._id].sort().join('_');
      onNavigate('chat', chatRoomId);
    };

    const userType = user?.userType;
    const canSeeProfesores = userType === 'profesor' || userType === 'preceptor';
    const canSeePreceptores = userType === 'preceptor';

    return (
      <div className="menu-container">
        <h2>Menú Principal</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {/* Chats de Grupo */}
        <div className="menu-buttons">
          <h3>Chats de Grupo</h3>
          <button onClick={() => onNavigate('chat', 'general')}>Chat General</button>
          <button onClick={() => onNavigate('chat', 'alumnos')}>Chat Alumnos</button>
          <button onClick={() => onNavigate('chat', 'profesores')} disabled={!canSeeProfesores}>
            Chat Profesores
          </button>
          <button onClick={() => onNavigate('chat', 'preceptores')} disabled={!canSeePreceptores}>
            Chat Preceptores
          </button>
        </div>

        {/* Chats Privados */}
        <div className="private-chat-section">
          <h3>Chats Privados</h3>
          {/* --- CAMBIO: Reemplazamos el <select> por un <input> de búsqueda --- */}
          <input
            type="text"
            placeholder="Busca un usuario por nombre..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedUser(null); // Limpiamos la selección si se cambia la búsqueda
            }}
          />
          {/* Mostramos la lista de resultados de la búsqueda */}
          {searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map(u => (
                <li key={u._id} onClick={() => handleSelectUser(u)}>
                  {u.username}
                </li>
              ))}
            </ul>
          )}
          <button onClick={handlePrivateChat} disabled={!selectedUser}>
            Iniciar Chat Privado
          </button>
        </div>
        
        {/* Otras Opciones */}
        <div className="menu-buttons" style={{marginTop: '20px'}}>
          <button onClick={() => onNavigate('informe')}>Ver Informe</button>
          <button onClick={onLogout}>Cerrar Sesión</button>
        </div>
      </div>
    );a
  };

  export default MenuPrincipal;

