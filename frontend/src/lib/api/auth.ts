import { AuthResponse } from '@/types/generated/models/AuthResponse';
import { LoginRequest } from '@/types/generated/models/LoginRequest';
import { RegisterRequest } from '@/types/generated/models/RegisterRequest';

/**
 * Logs in a user by sending their credentials to the backend API.
 * This function is designed to be called from the client-side (browser).
 * @param credentials - The user's email and password.
 * @returns A promise that resolves to the authentication response, including the JWT and user data.
 */
export async function loginUser(
  credentials: LoginRequest
): Promise<AuthResponse> {
  // For client-side requests, the API is accessed via localhost,
  // which is mapped to the backend container by Docker Compose.
  const apiUrl = 'http://localhost:8080/api/v1';

  const res = await fetch(`${apiUrl}/auth/login`, {
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
  const apiUrl = 'http://localhost:8080/api/v1';

  const res = await fetch(`${apiUrl}/auth/signup`, {
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
