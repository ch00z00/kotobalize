import {
  NewReviewRequest,
  NewWritingRequest,
  Writing,
} from '@/types/generated/models';
import { PUBLIC_API_BASE_URL } from '@/lib/api/config';

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
  const res = await fetch(`${PUBLIC_API_BASE_URL}/writings`, {
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
 * Fetches a list of all writings for the authenticated user.
 * Requires authentication.
 * @param token - The user's JWT for authorization.
 * @returns A promise that resolves to an array of writing objects.
 */
export async function getWritings(token: string): Promise<Writing[]> {
  const res = await fetch(`${PUBLIC_API_BASE_URL}/writings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch writings');
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
  const res = await fetch(`${PUBLIC_API_BASE_URL}/writings/${id}`, {
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
  const res = await fetch(`${PUBLIC_API_BASE_URL}/review`, {
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
