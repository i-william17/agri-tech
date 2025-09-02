import api from './api';

export const cropService = {
  getAll: () => {
    return api.get('/crops').then(res => res.data);
  },

  getById: (id) => {
    return api.get(`/crops/${id}`).then(res => res.data);
  },

  create: (cropData) => {
    return api.post('/crops', cropData).then(res => res.data);
  },

  update: (id, cropData) => {
    return api.put(`/crops/${id}`, cropData).then(res => res.data);
  },

  delete: (id) => {
    return api.delete(`/crops/${id}`).then(res => res.data);
  },

  getStats: () => {
    return api.get('/crops/stats').then(res => res.data);
  },

  getByType: () => {
    return api.get('/crops/types').then(res => res.data);
  }
};