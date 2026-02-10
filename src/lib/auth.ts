import { apiRequest } from './api';

export function registerUser(data: {
  email: string;
  username: string;
  password: string;
}) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function loginUser(data: {
  email: string;
  password: string;
}) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}


const TOKEN_KEY = 'auth_token';

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};
