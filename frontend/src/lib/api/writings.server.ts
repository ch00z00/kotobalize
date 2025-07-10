import { Writing } from '@/types/generated/models';
import { INTERNAL_API_BASE_URL } from '@/lib/api/config';

/**
 * Fetches a single writing record by its ID.
 * Requires authentication.
 * This function is intended to be used on the server side.
 * @param id - The ID of the writing to fetch.
 * @param token - The user's JWT for authorization.
 * @returns A promise that resolves to the writing object.
 */
export async function getWritingById(
  id: string,
  token: string
): Promise<Writing | null> {
  try {
    const res = await fetch(`${INTERNAL_API_BASE_URL}/writings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch writing');
    }
    return res.json();
  } catch (error) {
    console.error(`API call failed for writing ${id}:`, error);
    return null;
  }
}
