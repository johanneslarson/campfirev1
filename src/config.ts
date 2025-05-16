export const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:8081/api';

// If API_URL ends with /api, remove it to get the plain backend host (used for media URLs)
export const BACKEND_HOST = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL; 