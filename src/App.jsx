import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Chat from './components/Chat';
import Informe from './components/Informe';
import MenuPrincipal from './components/MenuPrincipal'; 
import { getAllUsers } from './api'; // Importamos la API

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [currentChat, setCurrentChat] = useState('general');
  const [allUsers, setAllUsers] = useState([]); // --- NUEVO: Estado para todos los usuarios
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.token && parsedUser.username) {
          setUser(parsedUser);
          setView('menu');
        } else {
          localStorage.removeItem('user');
        }
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // --- NUEVO: Cargar la lista de usuarios cuando el usuario inicia sesión ---
  useEffect(() => {
    if (user?.token) {
      getAllUsers(user.token)
        .then(setAllUsers)
        .catch(err => console.error("Error fetching users:", err));
    }
  }, [user?.token]);

  const handleLogin = (responseData) => {
    const userData = {
      token: responseData.token,
      id: responseData.id,
      username: responseData.username,
      email: responseData.email,
      userType: responseData.userType
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setView('menu');
  };

  const handleRegister = (userData) => {
    setLoading(true);
    handleLogin(userData);
    setLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setAllUsers([]);
    localStorage.removeItem('user');
    setView('login');
  };

  const navigate = (newView, chatType = 'general') => {
    if (newView === 'chat') {
      setCurrentChat(chatType);
    }
    setView(newView);
  }

  return (
    <div className="App">
      {view === 'login' && (
        <>
          <LoginForm onLogin={handleLogin} />
          <button onClick={() => setView('register')} style={{ marginTop: '20px' }}>
            ¿No tienes cuenta? Regístrate
          </button>
        </>
      )}
      
      {view === 'register' && (
        <>
          <RegisterForm onRegister={handleRegister} />
          <button onClick={() => setView('login')} style={{ marginTop: '20px' }} disabled={loading}>
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </>
      )}

      {view === 'menu' && user && (
        <MenuPrincipal 
          user={user}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}
      
      {view === 'chat' && user && (
        <Chat 
          user={user} 
          chatType={currentChat}
          allUsers={allUsers} // --- NUEVO: Pasamos la lista de usuarios al Chat
          onBack={() => navigate('menu')}
          onLogout={handleLogout}
        />
      )}

      {view === 'informe' && user && (
        <Informe 
          onBack={() => navigate('menu')}
        />
      )}
    </div>
  );
}

export default App;
