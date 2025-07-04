import { Theme } from '@/types/generated/models';
import { INTERNAL_API_BASE_URL, PUBLIC_API_BASE_URL } from '@/lib/api/config';

export interface NewThemeRequest {
  title: string;
  description: string;
  category: string;
}

/**
 * Fetches a list of all available themes from the backend API.
 * This function is designed to be run on the server side.
 * @returns A promise that resolves to an array of themes.
 */
export async function getThemes(): Promise<Theme[]> {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/themes`, {
      cache: 'no-store', // Always fetch the latest data in development
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
 * Fetches a single theme by its ID from the backend API.
 * This function is designed to be run on the server side.
 * @param id - The ID of the theme to fetch.
 * @returns A promise that resolves to the theme object, or null if not found.
 */
export async function getThemeById(id: string): Promise<Theme | null> {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/themes/${id}`, {
      cache: 'no-store', // Always fetch the latest data
    });

    if (!res.ok) {
      // Return null for 404 to be handled by the page component
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch theme: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(`API call failed for theme ${id}:`, error);
    return null;
  }
}

/**
 * Fetches a list of all available themes from the backend API.
 * This function is designed to be called from the client-side (browser).
 * @returns A promise that resolves to an array of themes.
 */
export async function getThemesForClient(): Promise<Theme[]> {
  try {
    // The /themes endpoint is public and does not require a token.
    const res = await fetch(`${PUBLIC_API_BASE_URL}/themes`);

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
