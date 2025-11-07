import { getAuth } from '../firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  status: number;
  statusText: string;
  body: string;

  constructor(status: number, statusText: string, body: string) {
    super(body || statusText);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';
export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  includeCredentials?: boolean;
  skipAuthError?: boolean;
  attachAuth?: boolean;
  // When true, a 404 response will return null instead of throwing.
  skipNotFound?: boolean;
}

async function buildAuthHeaders(): Promise<Record<string, string>> {
  const user = getAuth()?.currentUser;
  if (!user) {
    return {};
  }

  const headers: Record<string, string> = {
    'X-User-Id': user.uid,
  };

  if (user.email) {
    headers['X-User-Email'] = user.email;
  }

  return headers;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    includeCredentials = true,
    skipAuthError = false,
    attachAuth = true,
    skipNotFound = false,
  } = options;

  const authHeaders = attachAuth ? await buildAuthHeaders() : {};

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: includeCredentials ? 'include' : 'same-origin',
  });

  if (!response.ok) {
    if (skipAuthError && response.status === 401) {
      return null as T;
    }

    if (skipNotFound && response.status === 404) {
      return null as T;
    }

    const text = await response.text();
    throw new ApiError(response.status, response.statusText, text);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  request,
};
