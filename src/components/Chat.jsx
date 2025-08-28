import { useEffect, useState, useRef } from 'react';
import { getMessages, sendMessage } from '../api';

// --- CAMBIO 1: El componente ahora recibe 'chatType' como prop ---
function Chat({ user, chatType, onBack, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const chatBoxRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  // --- CAMBIO 2: La carga de mensajes ahora depende del chatType ---
  useEffect(() => {
    if (!user?.token || !chatType) return;

    const loadMessages = async () => {
      try {
        // Pasamos el chatType a la función de la API
        const data = await getMessages(user.token, chatType);
        setMessages(data);
      } catch (err) {
        console.error(`Error cargando mensajes para ${chatType}:`, err);
        setError("No se pudieron cargar los mensajes.");
      }
    };
    
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [user?.token, chatType]); // Se ejecuta de nuevo si el chatType cambia
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user?.token) return;
  
    setIsSending(true);
    setError(null);
    const tempId = Date.now();
    
    // --- CAMBIO 3: Incluimos el chatType en los datos del mensaje ---
    const messageData = {
      author: user.username,
      content: input,
      userType: user.userType,
      chatType: chatType // Añadimos el tipo de chat actual
    };
  
    try {
      setMessages(prev => [...prev, { _id: tempId, ...messageData, isTemp: true }]);
      setInput('');
  
      const saved = await sendMessage(user.token, messageData);
  
      setMessages(prev => prev.map(msg => msg._id === tempId ? saved : msg));
  
    } catch (err) {
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
      setError('Error al enviar. Intenta nuevamente.');
      console.error("Error al enviar:", err);
    } finally {
      setIsSending(false);
    }
  };

  const capitalize = (s) => {
    if (typeof s !== 'string' || !s) return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  return (
    <div className="chat-container">
      <header>
        {/* --- CAMBIO 4: El título del chat ahora es dinámico --- */}
        <h2>Chat de {capitalize(chatType)}</h2>
        <p>Conectado como: <strong>{user?.username}</strong> ({capitalize(user?.userType)})</p>
        
          <div className="chat-actions">
          <button onClick={onBack}>Volver al Menú</button>
          <button onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="chat-box" ref={chatBoxRef}>
        {messages.length === 0 ? (
          <p>No hay mensajes en este chat aún.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg._id || msg.id} className={`message ${msg.isTemp ? 'sending' : ''}`}>
              <strong>{msg.author}</strong> 
              <span className="user-type">({capitalize(msg.userType || 'Usuario')}):</span> 
              <p>{msg.content}</p>
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
