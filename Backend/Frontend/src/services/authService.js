/**
 * Purpose: Register / login; persists JWT in sessionStorage for SPA Authorization header.
 */
import { api, setAuthToken } from './api';

const KEY = 'filemagic_token';

export function getStoredToken() {
  return sessionStorage.getItem(KEY);
}

export function initAuthFromStorage() {
  const t = getStoredToken();
  if (t) setAuthToken(t);
}

export function logout() {
  sessionStorage.removeItem(KEY);
  setAuthToken(null);
}

export function saveToken(token) {
  sessionStorage.setItem(KEY, token);
  setAuthToken(token);
}

export async function register(email, password, displayName) {
  const { data } = await api.post('/api/auth/register', { email, password, displayName });
  if (data.accessToken) saveToken(data.accessToken);
  return data;
}

export async function login(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password });
  if (data.accessToken) saveToken(data.accessToken);
  return data;
}
