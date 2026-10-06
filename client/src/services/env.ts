import { env } from './env';

const API_BASE_URL = env.VITE_API_BASE_URL || 'http://localhost:4000';

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('cropadvisor-token') || 'demo-token';
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const body = await response.json();
      message = body?.error?.message || message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  return response.headers.get('content-type')?.includes('application/json') ? response.json() : response.text();
}

export const apiClient = {
  get: (path: string) => request(path, { method: 'GET' }),
  post: (path: string, body: unknown) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path: string, body: unknown) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path: string) => request(path, { method: 'DELETE' }),
};
