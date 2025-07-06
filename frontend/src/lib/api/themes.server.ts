import { Theme } from '@/types/generated/models';
import { INTERNAL_API_BASE_URL } from '@/lib/api/config';

/**
 * Fetches a list of all available themes from the backend API.
 * This function is designed to be run on the server side.
 * @returns A promise that resolves to an array of themes.
 */
export async function getThemes(token: string | undefined): Promise<Theme[]> {
  try {
    if (!token) {
      // Depending on your app's logic, you might want to throw an error
      // or return an empty array if no token is provided.
      // Returning empty for now to avoid breaking pages that might call this without a user.
      return [];
    }

    const res = await fetch(`${INTERNAL_API_BASE_URL}/themes`, {
      cache: 'no-store', // Always fetch the latest data in development
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch themes: ${res.status} ${res.statusText}`
      );
    }

    return res.json();
  } catch (error) {
    console.error('API call failed:', error);
    // Return an empty array on error to prevent the page from crashing.
    return [];
  }
}

/**
 * Fetches a single theme by its ID from the backend API.
 * This function is designed to be run on the server side.
 * @param id - The ID of the theme to fetch.
 * @returns A promise that resolves to the theme object, or null if not found.
 */
export async function getThemeById(
  id: string,
  token: string
): Promise<Theme | null> {
  try {
    if (!token) {
      throw new Error('Authorization token is required to fetch a theme.');
    }

    const res = await fetch(`${INTERNAL_API_BASE_URL}/themes/${id}`, {
      cache: 'no-store', // Always fetch the latest data
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      // Return null for 404 to be handled by the page component
      if (res.status === 404) return null;

      // For other errors, throw to be caught by the catch block
      throw new Error(`Failed to fetch theme: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(`API call failed for theme ${id}:`, error);
    return null;
  }
}
