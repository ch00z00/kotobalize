import { Theme } from '@/types/generated/models/Theme';

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
