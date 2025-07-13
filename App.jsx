import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Chat from './components/Chat';
import Informe from './components/Informe';
import MenuPrincipal from './components/MenuPrincipal'; // Nuevo componente

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(false);

  const handleLogin = (responseData) => {
    if (!responseData?.token || !responseData?.username || !responseData?.email || !responseData?.id) {
      throw new Error('Datos de autenticación incompletos');
    }

    const userData = {
      token: responseData.token,
      id: responseData.id,
      username: responseData.username,
      email: responseData.email
    };

    localStorage.setItem('token', userData.token);
    setUser(userData);
    setView('menu'); // Redirigir al menú principal después del login
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (!parsed.username) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      await handleLogin(userData);
    } catch (error) {
      console.error("Register error:", error);
      alert("Error en registro");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setView('login');
  };

  return (
    <div className="App">
      {view === 'login' && (
        <>
          <LoginForm onLogin={handleLogin} />
          <button 
            onClick={() => setView('register')}
            style={{ marginTop: '20px' }}
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </>
      )}
      
      {view === 'register' && (
        <>
          <RegisterForm onRegister={handleRegister} />
          <button 
            onClick={() => setView('login')}
            style={{ marginTop: '20px' }}
            disabled={loading}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </>
      )}

      {view === 'menu' && user && (
        <MenuPrincipal 
          onNavigate={(view) => setView(view)}
          onLogout={handleLogout}
        />
      )}
      
      {view === 'chat' && user && (
        <Chat 
          user={user} 
          onBack={() => setView('menu')} // Cambiado para volver al menú
          onLogout={handleLogout}
        />
      )}

      {view === 'informe' && user && (
        <Informe 
          onBack={() => setView('menu')} // Cambiado para volver al menú
        />
      )}
    </div>
  );
}

export default App;