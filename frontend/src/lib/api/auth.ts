import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '@/types/generated/models';
import { PUBLIC_API_BASE_URL } from '@/lib/api/config';

/**
 * Logs in a user by sending their credentials to the backend API.
 * This function is designed to be called from the client-side (browser).
 * @param credentials - The user's email and password.
 * @returns A promise that resolves to the authentication response, including the JWT and user data.
 */
export async function loginUser(
  credentials: LoginRequest
): Promise<AuthResponse> {
  const res = await fetch(`${PUBLIC_API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (!res.ok) {
    // The backend provides a structured error message, which we can throw.
    throw new Error(data.message || 'Failed to login');
  }

  return data;
}

/**
 * Registers a new user by sending their credentials to the backend API.
 * This function is designed to be called from the client-side (browser).
 * @param credentials - The new user's email and password.
 * @returns A promise that resolves to the authentication response, including the JWT and user data.
 */
export async function signupUser(
  credentials: RegisterRequest
): Promise<AuthResponse> {
  const res = await fetch(`${PUBLIC_API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to sign up');
  }

  return data;
}
