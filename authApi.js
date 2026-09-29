const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function readResponse(response) {
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const firstFieldError = payload && Object.values(payload).find((value) => Array.isArray(value) && value.length);
    throw new Error(payload?.detail || firstFieldError?.[0] || 'Something went wrong. Please try again.');
  }
  return payload;
}

async function getCsrfToken() {
  const response = await fetch(`${API_URL}/auth/csrf/`, { credentials: 'include' });
  const payload = await readResponse(response);
  return payload.csrfToken;
}

async function post(path, data) {
  const csrfToken = await getCsrfToken();
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
    body: JSON.stringify(data || {}),
  });
  return readResponse(response);
}

export async function getCurrentUser() {
  const response = await fetch(`${API_URL}/auth/me/`, { credentials: 'include' });
  if (response.status === 401 || response.status === 403) return null;
  return readResponse(response);
}

export const signUp = (data) => post('/auth/signup/', data);
export const signIn = (data) => post('/auth/login/', data);
export const signOut = () => post('/auth/logout/');
