import { Writing } from '@/types/generated/api';
import { INTERNAL_API_BASE_URL } from '@/lib/api/config';

/**
 * Fetches a single writing record by its ID.
 * Requires authentication.
 * This function is intended to be used on the server side.
 * @param id - The ID of the writing to fetch.
 * @param token - The user's JWT for authorization.
 * @returns A promise that resolves to the writing object, or null if not found.
 * @throws If the request fails for any reason other than 404.
 */
export async function getWritingById(
  id: string,
  token: string
): Promise<Writing | null> {
  const res = await fetch(`${INTERNAL_API_BASE_URL}/writings/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch writing ${id}: ${res.status}`
    );
  }

  return res.json();
}
