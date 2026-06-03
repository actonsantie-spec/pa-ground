import { request, setAuthToken, setCurrentUser, clearAuth, getCurrentUser } from './apiClient';
import { disconnectSocket } from '../socket/socketClient';

export async function loginUser(email, password) {
  const response = await request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  setAuthToken(response.token);
  setCurrentUser(response.user);
  return response.user;
}

export async function registerUser(name, email, password, role = 'BUYER', extra = {}) {
  const response = await request('/api/auth/register', {
    method: 'POST',
    body: { name, email, password, role, ...extra },
  });
  setAuthToken(response.token);
  setCurrentUser(response.user);
  return response.user;
}

export async function fetchCurrentUser() {
  try {
    const response = await request('/api/auth/me');
    setCurrentUser(response.user);
    return response.user;
  } catch (err) {
    if (err?.status === 401) {
      clearAuth();
    }
    throw err;
  }
}

export function logout() {
  clearAuth();
  disconnectSocket();
}

export function getUser() {
  return getCurrentUser();
}
