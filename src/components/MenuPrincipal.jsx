import React from 'react';

function MenuPrincipal({ onNavigate, onLogout }) {
  return (
    <div className="menu-principal">
      <h2>Menú Principal</h2>
      <div className="menu-options">
        <button onClick={() => onNavigate('chat')}>Ir al Chat</button>
        <button onClick={() => onNavigate('informe')}>Crear Informe</button>
        <button onClick={onLogout} className="logout-button">Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default MenuPrincipal;