/**
 * API Client helper.
 * Automatically handles attaching the Authorization token and checking for 401 Unauthorized responses.
 */

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<{ success: boolean; data?: T; message?: string; code: number }> {
  const token = sessionStorage.getItem('airguard_token');
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const { body, ...restOptions } = options;

  const config: RequestInit = {
    ...restOptions,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(endpoint, config);
    
    if (response.status === 401) {
      // Unauthorized — clear session and reload or trigger logout event
      sessionStorage.removeItem('airguard_token');
      window.dispatchEvent(new Event('auth_unauthorized'));
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      code: 500,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
