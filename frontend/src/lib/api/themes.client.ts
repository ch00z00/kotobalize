import { Theme } from '@/types/generated/models';
import { PUBLIC_API_BASE_URL } from '@/lib/api/config';

export interface NewThemeRequest {
  title: string;
  description: string;
  category: string;
}

/**
 * Creates a new theme.
 * This function is designed to be called from the client-side and requires authentication.
 * @param themeData - The data for the new theme.
 * @param token - The authentication token.
 * @returns A promise that resolves to the newly created theme.
 */
export async function createTheme(
  themeData: NewThemeRequest,
  token: string
): Promise<Theme> {
  console.log('createTheme called with:', themeData);
  const res = await fetch(`${PUBLIC_API_BASE_URL}/themes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(themeData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to create theme: ${res.statusText}`
    );
  }

  return res.json();
}

/**
 * Fetches a list of all available themes from the backend API.
 * This function is designed to be called from the client-side (browser).
 * @param token - The user's JWT for authorization.
 * @returns A promise that resolves to an array of themes.
 */
export async function getThemesForClient(token: string): Promise<Theme[]> {
  try {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/themes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch themes: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('API call failed:', error);
    // Return an empty array on error to prevent the page from crashing.
    return [];
  }
}
