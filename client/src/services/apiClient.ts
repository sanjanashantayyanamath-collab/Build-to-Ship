import { supabase } from './supabaseClient';
import type { ApiErrorResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export class ApiError extends Error {
  code: string;
  statusCode: number;
  details: Array<{ path: string; message: string }>;

  constructor(message: string, statusCode = 500, code = 'API_ERROR', details: Array<{ path: string; message: string }> = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

let onUnauthorizedCallback: (() => void) | null = null;

export function setOnUnauthorizedCallback(cb: () => void) {
  onUnauthorizedCallback = cb;
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Get current session token from Supabase Auth
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (netErr: any) {
    throw new ApiError('Unable to connect to the CropAdvisor server. Please check your network connection.', 0, 'NETWORK_ERROR');
  }

  if (response.status === 401) {
    if (onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
  }

  let data: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorBody: ApiErrorResponse['error'] = data?.error || {
      code: `HTTP_${response.status}`,
      message: response.statusText || 'An unexpected error occurred',
      details: [],
    };

    throw new ApiError(errorBody.message, response.status, errorBody.code, errorBody.details || []);
  }

  return data as T;
}
