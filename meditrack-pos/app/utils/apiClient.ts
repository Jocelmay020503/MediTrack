export function getToken() {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('authToken');
}

export async function apiFetch<T = unknown>(input: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = (data as { message?: string }).message || 'Request failed';
    throw new Error(message);
  }

  return data as T;
}
