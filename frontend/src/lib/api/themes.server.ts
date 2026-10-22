import { Theme } from '@/types/generated/api';
import { INTERNAL_API_BASE_URL } from '@/lib/api/config';

/**
 * Fetches a list of all available themes from the backend API.
 * This function is designed to be run on the server side.
 * @returns A promise that resolves to an array of themes.
 */
export async function getThemes(token: string | undefined): Promise<Theme[]> {
  if (!token) {
    // Returning empty to avoid breaking pages that might call this without a user.
    return [];
  }

  const res = await fetch(`${INTERNAL_API_BASE_URL}/themes`, {
    cache: 'no-store', // Always fetch the latest data
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch themes: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Fetches a single theme by its ID from the backend API.
 * This function is designed to be run on the server side.
 * @param id - The ID of the theme to fetch.
 * @returns A promise that resolves to the theme object, or null if not found.
 * @throws If the request fails for any reason other than 404.
 */
export async function getThemeById(
  id: string,
  token: string
): Promise<Theme | null> {
  const res = await fetch(`${INTERNAL_API_BASE_URL}/themes/${id}`, {
    cache: 'no-store', // Always fetch the latest data
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Return null for 404 to be handled by the page component
  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(
      `Failed to fetch theme ${id}: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}
