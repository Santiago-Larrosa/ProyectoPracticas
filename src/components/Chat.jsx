import { useEffect, useState } from 'react';
import { getMessages, sendMessage } from '../api';

function Chat({ user, onBack, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  // Cargar mensajes con reintento
  const loadMessages = async () => {
    try {
      const data = await getMessages(user.token);
      setMessages(data);
    } catch (err) {
      console.error("Error cargando mensajes:", err);
      setTimeout(loadMessages, 3000);
    }
  };
  

  useEffect(() => {
    if (!user?.token) return;
    loadMessages();
  
    const interval = setInterval(loadMessages, 10000);
    return () => clearInterval(interval);
  }, [user?.token]);
  


  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user?.token) return;
  
    setIsSending(true);
    setError(null);
    const tempId = Date.now();
  
    try {
      // 1. Mostrar mensaje inmediatamente
      setMessages(prev => [...prev, {
        _id: tempId,
        author: user.username,
        content: input,
        isTemp: true // Marcamos como temporal
      }]);
      setInput('');
  
      // 2. Enviar al servidor
      const saved = await sendMessage(user.token, {
        author: user.username,
        content: input
      });
  
      // 3. Reemplazar por mensaje real
      setMessages(prev => prev.map(msg => 
        msg._id === tempId ? saved : msg
      ));
  
    } catch (err) {
      // 4. Remover mensaje temporal si falla
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
      setError('Error al enviar. Intenta nuevamente.');
      console.error("Error al enviar:", err);
    } finally {
      // 5. Siempre desactivar el estado de envío
      setIsSending(false);
    }
  };

  return (
    <div className="chat-container">
      <header>
        <h2>Chat General</h2>
        <p>Conectado como: <strong>{user?.username}</strong></p>
        
          <div className="chat-actions">
          <button onClick={onBack}>Volver al Menú</button>
          <button onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="chat-box">
        {messages.length === 0 ? (
          <p>No hay mensajes aún</p>
        ) : (
          messages.map((msg) => (
            <div key={msg._id || msg.id} className="message">
              <strong>{msg.author}:</strong> {msg.content}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          disabled={isSending}
        />
        <button 
          type="submit" 
          disabled={isSending || !input.trim()}
          aria-busy={isSending}
        >
          {isSending ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}

export default Chat;