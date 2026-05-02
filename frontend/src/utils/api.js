// Central API base URL — uses env var in dev/prod, fallback to deployed URL
export const API_BASE = import.meta.env.VITE_API_BASE || 'https://portfoliosite-delta-eight.vercel.app';

// ─── Auth helpers ─────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem('vault_token');

export const getUser = () => {
  try {
    const u = localStorage.getItem('vault_user');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};

export const setAuth = (token, user) => {
  localStorage.setItem('vault_token', token);
  localStorage.setItem('vault_user', JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem('vault_token');
  localStorage.removeItem('vault_user');
};

// ─── Authenticated fetch ──────────────────────────────────────────────────────
// All requests automatically include the Bearer token in the Authorization header.
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

// ─── Authenticated document URL ───────────────────────────────────────────────
// Documents are served through an authenticated backend endpoint, NOT a public
// static path. This ensures only logged-in users can access personal documents.
export const getDocumentUrl = (filename) => {
  const token = getToken();
  // Append token as query param for download links / new tab opens
  return `${API_BASE}/api/vault/document/${encodeURIComponent(filename)}?token=${token}`;
};
