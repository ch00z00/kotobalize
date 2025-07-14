import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ApiError,
} from '@/types/generated/api';
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

  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as ApiError;
    throw new Error(
      errorData.message || `ログインに失敗しました: ${res.statusText}`
    );
  }
  return res.json();
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

  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as ApiError;
    throw new Error(
      errorData.message || `新規登録に失敗しました: ${res.statusText}`
    );
  }
  return res.json();
}
