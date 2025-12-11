import axios from "axios";

const API_BASE_URL = "http://backend.local/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Étudiants
export const etudiantApi = {
  getAll: (params) => api.get("/etudiants", { params }),
  getById: (id) => api.get(`/etudiants/${id}`),
  create: (data) => api.post("/etudiants", data),
  update: (id, data) => api.put(`/etudiants/${id}`, data),
  delete: (id) => api.delete(`/etudiants/${id}`),
  getInscriptions: (id) => api.get(`/etudiants/${id}/inscriptions`),
};

// Cours
export const coursApi = {
  getAll: (params) => api.get("/cours", { params }),
  getById: (id) => api.get(`/cours/${id}`),
  create: (data) => api.post("/cours", data),
  update: (id, data) => api.put(`/cours/${id}`, data),
  delete: (id) => api.delete(`/cours/${id}`),
  getInscriptions: (id) => api.get(`/cours/${id}/inscriptions`),
};

// Inscriptions
export const inscriptionApi = {
  getAll: (params) => api.get("/inscriptions", { params }),
  getStats: () => api.get("/inscriptions/stats"),
  getById: (id) => api.get(`/inscriptions/${id}`),
  create: (data) => api.post("/inscriptions", data),
  update: (id, data) => api.put(`/inscriptions/${id}`, data),
  delete: (id) => api.delete(`/inscriptions/${id}`),
};

export default api;
