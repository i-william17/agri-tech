import api from './api';

let authToken = null;

export const authService = {
  setToken: (token) => {
    authToken = token;
  },

  login: (email, password) => {
    return api.post('/auth/login', { email, password }).then(res => res.data);
  },

  register: (userData) => {
    return api.post('/auth/register', userData).then(res => res.data);
  },

  getMe: () => {
    return api.get('/auth/me').then(res => res.data);
  },

  logout: () => {
    authToken = null;
    localStorage.removeItem('token');
  }
};