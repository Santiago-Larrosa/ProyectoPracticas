import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Chat from './components/Chat';
import Informe from './components/Informe';
import MenuPrincipal from './components/MenuPrincipal'; 

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [currentChat, setCurrentChat] = useState('general');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.token && parsedUser.username && parsedUser.id && parsedUser.userType) {
          setUser(parsedUser);
          setView('menu');
        } else {
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error("Error al parsear datos de usuario:", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (responseData) => {
    if (!responseData?.token || !responseData?.username || !responseData?.id || !responseData.userType) {
      console.error('Datos de autenticación incompletos recibidos:', responseData);
      return; 
    }

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

  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      handleLogin(userData);
    } catch (error) {
      console.error("Register error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
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
          user={user} // --- CAMBIO: Pasamos el objeto de usuario al menú ---
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}
      
      {view === 'chat' && user && (
        <Chat 
          user={user} 
          chatType={currentChat}
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
