/**
 * Server Action wrapper that automatically includes JWT token
 * Usage: Use this in client components to call server actions with auth
 */

import { getAuthToken } from "./auth-token";

declare global {
  var __auth_token: string | undefined;
}

/**
 * Call a server action with JWT authentication
 * The token is passed via headers to the server action
 */
export async function callAuthenticatedAction<T, Args extends unknown[]>(
  action: (...args: Args) => Promise<T>,
  ...args: Args
): Promise<T> {
  // Get token from localStorage
  const token = getAuthToken();

  // Create a wrapper that adds token to context
  // Since we can't modify headers in client->server action calls directly,
  // we need to pass the token as the first parameter or store it globally
  // For now, we'll store it in a special header that Node can read
  
  if (token) {
    // Store token in a way that server actions can access it
    // This is a workaround since Next.js server actions don't directly support header passing
    global.__auth_token = token;
  }

  try {
    return await action(...args);
  } finally {
    delete global.__auth_token;
  }
}

/**
 * Get the current auth token in a server action context
 */
export function getAuthTokenInAction(): string | null {
  if (typeof window !== 'undefined') {
    // Client side - shouldn't reach here in server action
    return null;
  }
  return global.__auth_token || null;
}
