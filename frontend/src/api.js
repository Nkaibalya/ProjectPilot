import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email); 
  formData.append('password', password);

  const response = await axios.post(`${API_URL}/token`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return response.data;
};

// Data fetching
export const fetchDashboardStats = async () => {
  const response = await api.get('/dashboard/');
  return response.data;
}

export const fetchProjects = async () => {
  const response = await api.get('/projects/');
  return response.data;
};

export const fetchProject = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await api.post('/projects/', projectData);
  return response.data;
};

export const fetchIssues = async (projectId = null, search = '') => {
  let url = '/issues/';
  const params = new URLSearchParams();
  if (projectId) params.append('project_id', projectId);
  if (search) params.append('search', search);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await api.get(url);
  return response.data;
};

export const fetchIssue = async (id) => {
  const response = await api.get(`/issues/${id}`);
  return response.data;
};

// Issues
export const createIssue = async (issueData) => {
  const response = await api.post('/issues/', issueData);
  return response.data;
};

export const updateIssue = async (id, updateData) => {
  const response = await api.put(`/issues/${id}`, updateData);
  return response.data;
}

export const fetchComments = async (issueId) => {
  const response = await api.get(`/issues/${issueId}/comments`);
  return response.data;
};

export const addComment = async (commentData) => {
  const response = await api.post('/comments/', commentData);
  return response.data;
};

export const fetchUsers = async () => {
  const response = await api.get('/users/');
  return response.data;
};

export default api;
