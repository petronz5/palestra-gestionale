// src/utils/Auth.js
const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'jwt_user';

export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const saveUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
};
export const clearUser = () => localStorage.removeItem(USER_KEY);

export const isAuthenticated = () => Boolean(getToken());
export const getRole = () => getUser()?.ruolo || 'cliente';
