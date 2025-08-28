import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Chat from './components/Chat';
import Informe from './components/Informe';
import MenuPrincipal from './components/MenuPrincipal';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(false);

  // Función de login actualizada para recibir y guardar el userType
  const handleLogin = (responseData) => {
    // Verificación de datos de autenticación completos
    if (!responseData?.token || !responseData?.username || !responseData?.email || !responseData?.id || !responseData?.userType) {
      // Si falta userType, intentamos recuperarlo o asumimos un valor por defecto
      console.warn('Datos de autenticación incompletos. Falta userType.');
      // Podrías manejar este caso, por ejemplo, asignando un rol por defecto si es necesario.
    }

    const userData = {
      token: responseData.token,
      id: responseData.id,
      username: responseData.username,
      email: responseData.email,
      userType: responseData.userType, // Guardamos el tipo de usuario
    };

    // Guardamos el objeto de usuario completo en localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setView('menu'); // Redirigir al menú principal después del login
  };

  useEffect(() => {
    // Al cargar la app, intentamos recuperar los datos del usuario
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Validamos que el objeto recuperado tenga las propiedades necesarias
        if (parsedUser.token && parsedUser.username && parsedUser.id && parsedUser.userType) {
          setUser(parsedUser);
          setView('menu');
        } else {
          // Si los datos están corruptos o incompletos, limpiamos localStorage
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error("Error al parsear datos de usuario:", error);
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  // La función de registro ahora simplemente llama a handleLogin con los datos recibidos
  const handleRegister = (userData) => {
    try {
      setLoading(true);
      handleLogin(userData); // La respuesta del registro ya contiene todo lo necesario
    } catch (error) {
      console.error("Register error:", error);
      // Aquí podrías mostrar un mensaje de error más amigable
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Asegúrate de remover 'user' y no 'token'
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
          user={user} // Pasamos el usuario al menú por si necesitas mostrar su rol
          onNavigate={(view) => setView(view)}
          onLogout={handleLogout}
        />
      )}
      
      {view === 'chat' && user && (
        <Chat 
          user={user} 
          onBack={() => setView('menu')}
          onLogout={handleLogout}
        />
      )}

      {view === 'informe' && user && (
        <Informe 
          user={user} // También puedes pasar el usuario aquí
          onBack={() => setView('menu')}
        />
      )}
    </div>
  );
}

export default App;
