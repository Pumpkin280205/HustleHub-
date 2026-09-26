import axios from 'axios';

export const STORAGE_KEY = 'hh_auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  try {
    const auth = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    if (auth?.token) config.headers.Authorization = `Bearer ${auth.token}`;
  } catch { /* no valid session stored */ }
  return config;
});

// Expired or invalid token on a protected route: clear session and go to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthRoute = error.config?.url?.startsWith('/auth/');
    if (error.response?.status === 401 && !isAuthRoute) {
      sessionStorage.removeItem(STORAGE_KEY);
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

// Turn any error into a safe message for the UI;
export const getErrorMessage = (error) => {
  if (!error.response) return 'Cannot reach the server. Please try again.';
  const { status, data } = error.response;
  if (status === 400) return data?.message || 'Please check your input.';
  if (status === 401) return 'Invalid email or password.';
  if (status === 403) return 'You are not allowed to do that.';
  if (status === 404) return 'Not found.';
  if (status === 409) return 'An account with that email already exists.';
  if (status === 429) return 'Too many attempts. Please wait and try again.';
  return 'Something went wrong. Please try again.';
};

export const getFieldErrors = (error) => {
  const list = error.response?.status === 400 ? error.response.data?.errors : null;
  if (!Array.isArray(list)) return {};
  return Object.fromEntries(list.map(({ field, message }) => [field, message.replace(/"/g, '')]));
};


export default api;
