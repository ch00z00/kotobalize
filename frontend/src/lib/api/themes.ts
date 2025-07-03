import { Theme } from '@/types/generated/models';

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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    // This error should now be prevented by .env.local
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }

  try {
    const res = await fetch(`${apiUrl}/themes`, {
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }

  const res = await fetch(`${apiUrl}/themes`, {
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }

  try {
    const res = await fetch(`${apiUrl}/themes/${id}`, {
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
  // For client-side requests, the API is accessed via localhost.
  const apiUrl = 'http://localhost:8080/api/v1';

  try {
    // The /themes endpoint is public and does not require a token.
    const res = await fetch(`${apiUrl}/themes`);

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
