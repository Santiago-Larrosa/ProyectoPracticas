// --- CORRECCIÓN: Usamos la URL completa del servidor para evitar problemas de conexión (CORS / Failed to fetch) ---
const API_BASE = 'http://localhost:4000/api';

export const registerUser = async (data) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error en el registro');
  }
  return res.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error en autenticación');
  }
  return response.json();
};

export const getMessages = async (token, chatType) => {
  const res = await fetch(`${API_BASE}/messages/${chatType}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al obtener mensajes');
  }
  return res.json();
};

export const sendMessage = async (token, messageData) => {
  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(messageData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al enviar mensaje');
  }
  return res.json();
};

export const getAllUsers = async (token, searchTerm = '') => {
  const url = `${API_BASE}/users${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al obtener la lista de usuarios');
  }
  return res.json();
};

  