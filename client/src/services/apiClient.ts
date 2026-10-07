const defaultBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('cropadvisor-token') || 'demo-token';
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${defaultBase}${path}`, { ...options, headers });

  const text = await response.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok) {
    const message = body?.error?.message || body?.message || 'Request failed';
    throw new Error(message);
  }

  return body as T;
}

export const apiClient = {
  get: <T>(path: string) => apiRequest<T>(path, { method: 'GET' }),
  post: <T>(path: string, data: unknown) => apiRequest<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(path: string, data: unknown) => apiRequest<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
  del: <T>(path: string) => apiRequest<T>(path, { method: 'DELETE' }),
};
