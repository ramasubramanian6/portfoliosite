// Central API base URL — uses env var in dev, production URL as fallback
export const API_BASE = import.meta.env.VITE_API_BASE || 'https://portfoliosite-delta-eight.vercel.app';

// Auth helpers
export const getToken = () => localStorage.getItem('vault_token');
export const getUser = () => {
  const u = localStorage.getItem('vault_user');
  return u ? JSON.parse(u) : null;
};
export const setAuth = (token, user) => {
  localStorage.setItem('vault_token', token);
  localStorage.setItem('vault_user', JSON.stringify(user));
};
export const clearAuth = () => {
  localStorage.removeItem('vault_token');
  localStorage.removeItem('vault_user');
};

// Authenticated fetch helper
export const authFetch = async (url, options = {}) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  return res;
};
