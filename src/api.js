const API_BASE = 'http://localhost:4000/api';

export const registerUser = async (data) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const responseData = await res.json();
  if (!res.ok) {
      throw new Error(responseData.error || 'Error en el registro');
  }
  return responseData;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error en autenticación');
  }

  return response.json();
};

// --- CAMBIO CLAVE AQUÍ ---
// La función ahora necesita saber de qué chat obtener los mensajes.
export const getMessages = async (token, chatType) => {
  // Se añade el 'chatType' a la URL de la petición.
  const res = await fetch(`${API_BASE}/messages/${chatType}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al obtener mensajes');
  return res.json();
};

// Esta función no necesita cambios, ya que 'messageData' contendrá el chatType.
export const sendMessage = async (token, messageData) => {
  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(messageData),
  });
  if (!res.ok) throw new Error('Error al enviar mensaje');
  return res.json();
};
