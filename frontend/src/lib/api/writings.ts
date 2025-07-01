import {
  NewReviewRequest,
  NewWritingRequest,
  Writing,
} from '@/types/generated/models';

/**
 * Submits a new writing to the backend.
 * This function is designed to be called from the client-side and requires authentication.
 * @param writingData - The data for the new writing.
 * @param token - The user's JWT for authorization.
 * @returns A promise that resolves to the newly created writing object.
 */
export async function createWriting(
  writingData: NewWritingRequest,
  token: string
): Promise<Writing> {
  const apiUrl = 'http://localhost:8080/api/v1';

  const res = await fetch(`${apiUrl}/writings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(writingData),
  });

  const data = await res.json();

  if (!res.ok) {
    // The backend provides a structured error message, which we can throw.
    throw new Error(data.message || 'Failed to create writing');
  }

  return data;
}

/**
 * Fetches a single writing record by its ID.
 * Requires authentication.
 * @param id - The ID of the writing to fetch.
 * @param token - The user's JWT for authorization.
 * @returns A promise that resolves to the writing object.
 */
export async function getWritingById(
  id: string,
  token: string
): Promise<Writing> {
  const apiUrl = 'http://localhost:8080/api/v1';

  const res = await fetch(`${apiUrl}/writings/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch writing');
  }

  return data;
}

/**
 * Triggers an AI review for a specific writing.
 * Requires authentication.
 * @param reviewRequest - The request containing the writing ID.
 * @param token - The user's JWT for authorization.
 * @returns A promise that resolves to the updated writing object with AI feedback.
 */
export async function requestAiReview(
  reviewRequest: NewReviewRequest,
  token: string
): Promise<Writing> {
  const apiUrl = 'http://localhost:8080/api/v1';

  const res = await fetch(`${apiUrl}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewRequest),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to request AI review');
  }

  return data;
}
