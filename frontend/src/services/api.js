import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions

// Users
export const getUsers = () => api.get('/users/');
export const getUser = (id) => api.get(`/users/${id}/`);
export const getCurrentUser = () => api.get('/users/me/');
export const createUser = (data) => api.post('/users/', data);
export const getFacilitators = () => api.get('/users/facilitators/');
export const getParticipants = () => api.get('/users/participants/');

// Events
export const getEvents = () => api.get('/events/');
export const getEvent = (id) => api.get(`/events/${id}/`);
export const createEvent = (data) => api.post('/events/', data);
export const updateEvent = (id, data) => api.put(`/events/${id}/`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}/`);
export const getActiveEvents = () => api.get('/events/active/');
export const getUpcomingEvents = () => api.get('/events/upcoming/');
export const getEventQuests = (eventId) => api.get(`/events/${eventId}/quests/`);

// Skills
export const getSkills = () => api.get('/skills/');
export const getSkill = (id) => api.get(`/skills/${id}/`);
export const createSkill = (data) => api.post('/skills/', data);
export const updateSkill = (id, data) => api.put(`/skills/${id}/`, data);
export const deleteSkill = (id) => api.delete(`/skills/${id}/`);

// Quests
export const getQuests = () => api.get('/quests/');
export const getQuest = (id) => api.get(`/quests/${id}/`);
export const createQuest = (data) => api.post('/quests/', data);
export const updateQuest = (id, data) => api.put(`/quests/${id}/`, data);
export const deleteQuest = (id) => api.delete(`/quests/${id}/`);
export const getQuestTasks = (questId) => api.get(`/quests/${questId}/tasks/`);
export const startQuest = (questId) => api.post(`/quests/${questId}/start/`);
export const generateQuestStory = (questId) => api.post(`/quests/${questId}/generate_story/`);

// Tasks
export const getTasks = () => api.get('/tasks/');
export const getTask = (id) => api.get(`/tasks/${id}/`);
export const createTask = (data) => api.post('/tasks/', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}/`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}/`);
export const validateTask = (taskId, data) => api.post(`/tasks/${taskId}/validate/`, data);
export const generateTaskContext = (taskId) => api.post(`/tasks/${taskId}/generate_context/`);

// Progress
export const getQuestProgress = () => api.get('/progress/');
export const getMyProgress = () => api.get('/progress/my_progress/');
export const getProgress = (id) => api.get(`/progress/${id}/`);

// Badges
export const getBadges = () => api.get('/badges/');
export const getBadge = (id) => api.get(`/badges/${id}/`);
export const createBadge = (data) => api.post('/badges/', data);

// Certificates
export const getCertificates = () => api.get('/certificates/');
export const getCertificate = (id) => api.get(`/certificates/${id}/`);

// Participant Skills
export const getParticipantSkills = () => api.get('/participant-skills/');
export const getMySkills = () => api.get('/participant-skills/my_skills/');

export default api;