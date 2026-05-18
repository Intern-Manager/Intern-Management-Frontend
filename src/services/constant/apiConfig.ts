const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5131';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  CAMPAIGNS: '/api/campaigns',
  APPLICATIONS: '/api/applications',
  INTERVIEWS: '/api/interviews',
};

export { BASE_URL };
