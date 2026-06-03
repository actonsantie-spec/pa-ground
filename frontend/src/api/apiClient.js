const API_BASE = process.env.REACT_APP_API_URL || '';
const AUTH_TOKEN_KEY = 'pa_ground_token';
const USER_STORAGE_KEY = 'pa_ground_user';

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function removeAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

function getApiErrorMessage(status, data) {
  if (status === 401) {
    return data?.error || 'Session expired. Please log in again.';
  }
  if (status === 403) {
    return data?.error || 'You do not have permission to perform this action.';
  }
  if (status >= 500) {
    return 'Server error. Please try again later.';
  }
  return data?.error || data?.message || 'Request failed. Please try again.';
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

export function getCurrentUser() {
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (err) {
    return null;
  }
}

export function clearAuth() {
  removeAuthToken();
  localStorage.removeItem(USER_STORAGE_KEY);
}

export async function request(path, options = {}) {
  const { method = 'GET', body, headers = {}, ...rest } = options;
  const url = `${API_BASE}${path}`;
  const token = getAuthToken();
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers: defaultHeaders,
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const message = getApiErrorMessage(response.status, data);
    if (response.status === 401) {
      clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    const error = new Error(message);
    error.status = response.status;
    error.response = data;
    throw error;
  }

  return data;
}
