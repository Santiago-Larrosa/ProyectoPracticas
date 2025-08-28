import React from 'react';

// --- CAMBIO 1: El componente ahora recibe el objeto 'user' ---
const MenuPrincipal = ({ user, onNavigate, onLogout }) => {
  
  // --- CAMBIO 2: Lógica para determinar los permisos del usuario ---
  const userType = user?.userType;
  const canSeeProfesores = userType === 'profesor' || userType === 'preceptor';
  const canSeePreceptores = userType === 'preceptor';

  return (
    <div className="menu-container">
      <h2>Menú Principal</h2>
      <div className="menu-buttons">
        <button onClick={() => onNavigate('chat', 'general')}>Chat General</button>
        <button onClick={() => onNavigate('chat', 'alumnos')}>Chat Alumnos</button>
        {/* --- CAMBIO 3: Los botones se desactivan según los permisos --- */}
        <button 
          onClick={() => onNavigate('chat', 'profesores')} 
          disabled={!canSeeProfesores}
          title={!canSeeProfesores ? "Acceso restringido" : ""}
        >
          Chat Profesores
        </button>
        <button 
          onClick={() => onNavigate('chat', 'preceptores')} 
          disabled={!canSeePreceptores}
          title={!canSeePreceptores ? "Acceso restringido" : ""}
        >
          Chat Preceptores
        </button>
        <button onClick={() => onNavigate('informe')}>Ver Informe</button>
        <button onClick={onLogout}>Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default MenuPrincipal;
