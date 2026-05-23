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

import type { User, Device } from '../types';

export async function getMe(): Promise<{ success: boolean; data?: User; message?: string; code: number }> {
  return apiFetch<User>('/api/auth/users/me');
}

export async function getDevices(userId: number): Promise<{ success: boolean; data?: Device[]; message?: string; code: number }> {
  return apiFetch<Device[]>(`/api/device/user/${userId}`);
}

export async function createDevice(deviceConfig: Omit<Device, 'userId' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; data?: Device; message?: string; code: number }> {
  return apiFetch<Device>('/api/device/register', {
    method: 'POST',
    body: deviceConfig,
  });
}

export async function updateDevice(deviceId: string, deviceConfig: Omit<Device, 'deviceId' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; data?: Device; message?: string; code: number }> {
  return apiFetch<Device>(`/api/device/${deviceId}`, {
    method: 'PUT',
    body: deviceConfig,
  });
}

export async function deleteDevice(deviceId: string): Promise<{ success: boolean; message?: string; code: number }> {
  return apiFetch<undefined>(`/api/device/delete?deviceId=${deviceId}`, {
    method: 'DELETE',
  });
}
