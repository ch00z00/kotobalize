import { Theme } from '@/types/generated/models';
import { cookies } from 'next/headers';
import { INTERNAL_API_BASE_URL } from '@/lib/api/config';

/**
 * Fetches a list of all available themes from the backend API.
 * This function is designed to be run on the server side.
 * @returns A promise that resolves to an array of themes.
 */
export async function getThemes(): Promise<Theme[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${INTERNAL_API_BASE_URL}/themes`, {
      cache: 'no-store', // Always fetch the latest data in development
      headers,
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
export async function getThemeById(id: string): Promise<Theme | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${INTERNAL_API_BASE_URL}/themes/${id}`, {
      cache: 'no-store', // Always fetch the latest data
      headers,
    });

    if (!res.ok) {
      // Return null for 404 to be handled by the page component
      if (res.status === 404) return null;
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch theme: ${res.statusText}`
      );
    }
    return res.json();
  } catch (error) {
    console.error(`API call failed for theme ${id}:`, error);
    return null;
  }
}
