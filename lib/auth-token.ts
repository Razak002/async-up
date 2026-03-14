/**
 * JWT Token Management
 * Get token from localStorage for client-side use
 */

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('auth-token');
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('auth-token', token);
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem('auth-token');
}

export function getAuthTokenFromRequest(headers: Headers): string | null {
  return headers.get('Authorization')?.replace('Bearer ', '') || null;
}

export function setAuthTokenInHeaders(headers: Headers, token: string): void {
  headers.set('Authorization', `Bearer ${token}`);
}
