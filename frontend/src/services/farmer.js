import api from './api';

export const farmerService = {
  getAll: () => {
    return api.get('/farmers').then(res => res.data);
  },

  getById: (id) => {
    return api.get(`/farmers/${id}`).then(res => res.data);
  },

  create: (farmerData) => {
    return api.post('/farmers', farmerData).then(res => res.data);
  },

  update: (id, farmerData) => {
    return api.put(`/farmers/${id}`, farmerData).then(res => res.data);
  },

  delete: (id) => {
    return api.delete(`/farmers/${id}`).then(res => res.data);
  }
};