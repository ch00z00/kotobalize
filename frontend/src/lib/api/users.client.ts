import { PUBLIC_API_BASE_URL } from './config';
import { User } from '@/types/generated/models';

/**
 * Requests a presigned URL from the backend for uploading an avatar image.
 * @param fileName - The name of the file to be uploaded.
 * @param fileType - The MIME type of the file.
 * @param token - The user's JWT.
 * @returns A promise that resolves to an object containing the upload URL and the file key.
 */
export async function getAvatarUploadUrl(
  fileName: string,
  fileType: string,
  token: string
): Promise<{ uploadUrl: string; key: string }> {
  const res = await fetch(`${PUBLIC_API_BASE_URL}/users/me/avatar/upload-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fileName, fileType }),
  });

  if (!res.ok) {
    throw new Error('Failed to get upload URL');
  }
  return res.json();
}

/**
 * Updates the user's avatar URL in the backend.
 * @param avatarUrl - The new URL of the uploaded avatar.
 * @param token - The user's JWT.
 * @returns A promise that resolves to the updated user object.
 */
export async function updateUserAvatar(
  avatarUrl: string,
  token: string
): Promise<User> {
  const res = await fetch(`${PUBLIC_API_BASE_URL}/users/me/avatar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ avatarUrl }),
  });

  if (!res.ok) {
    throw new Error('Failed to update avatar');
  }
  return res.json();
}
