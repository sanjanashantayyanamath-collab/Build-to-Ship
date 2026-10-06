const defaultBase = 'http://localhost:4000';

async function request(path: string, options: RequestInit = {}) {
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

  return body;
}

export const apiClient = {
  get: (path: string) => request(path, { method: 'GET' }),
  post: (path: string, data: unknown) => request(path, { method: 'POST', body: JSON.stringify(data) }),
  put: (path: string, data: unknown) => request(path, { method: 'PUT', body: JSON.stringify(data) }),
  del: (path: string) => request(path, { method: 'DELETE' }),
};
