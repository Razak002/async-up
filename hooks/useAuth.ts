/**
 * useAuth Hook
 * Provides authentication state and methods for client components
 */

'use client';

import { useState } from 'react';
import { API_URL } from '@/lib/api-config';

interface AuthUser {
  id: string;
  email: string;
  user_metadata?: Record<string, string>;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

function readStoredAuth(): AuthState {
  if (typeof window === 'undefined') {
    return { user: null, isLoading: false, isAuthenticated: false };
  }
  const storedToken = localStorage.getItem('auth-token');
  const storedUser = localStorage.getItem('auth-user');
  if (storedToken && storedUser) {
    try {
      const user = JSON.parse(storedUser) as AuthUser;
      return { user, isLoading: false, isAuthenticated: true };
    } catch {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
    }
  }
  return { user: null, isLoading: false, isAuthenticated: false };
}

export function useAuth() {
  // Lazy initializer: reads localStorage once on first render — no useEffect needed
  const [state, setState] = useState<AuthState>(readStoredAuth);

  const signUp = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName: email.split('@')[0] })
    });
    const data = await res.json();
    if (!res.ok) return { data: null, error: { message: data.error || 'Signup failed' } };
    const user: AuthUser = { id: data._id, email: data.email, user_metadata: { fullName: data.fullName } };
    localStorage.setItem('auth-token', data.token);
    localStorage.setItem('auth-user', JSON.stringify(user));
    setState({ user, isLoading: false, isAuthenticated: true });
    return { data: { user, session: { access_token: data.token } }, error: null };
  };

  const signIn = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) return { data: null, error: { message: data.error || 'Login failed' } };
    const user: AuthUser = { id: data._id, email: data.email, user_metadata: { fullName: data.fullName } };
    localStorage.setItem('auth-token', data.token);
    localStorage.setItem('auth-user', JSON.stringify(user));
    setState({ user, isLoading: false, isAuthenticated: true });
    return { data: { user, session: { access_token: data.token } }, error: null };
  };

  const signOut = async () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
    setState({ user: null, isLoading: false, isAuthenticated: false });
    return null;
  };

  const resetPassword = async (_email: string) => {
    return { message: 'Not implemented yet' };
  };

  return { ...state, signUp, signIn, signOut, resetPassword };
}
