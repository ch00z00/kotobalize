import { PUBLIC_API_BASE_URL } from './config';
import {
  Activity,
  User,
  ApiError,
  UpdatePasswordRequest,
  UpdateAvatarRequest,
  AvatarUploadRequest,
  UpdateProfileRequest,
} from '@/types/generated/api';

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
  // This could be AvatarUploadResponse
  const res = await fetch(`${PUBLIC_API_BASE_URL}/users/me/avatar/upload-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fileName, fileType } as AvatarUploadRequest),
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
    body: JSON.stringify({ avatarUrl } as UpdateAvatarRequest),
  });

  if (!res.ok) {
    throw new Error('Failed to update avatar');
  }
  return res.json();
}

/**
 * Deletes the user's avatar.
 * @param token - The user's JWT.
 * @returns A promise that resolves to the updated user object.
 */
export async function deleteUserAvatar(token: string): Promise<User> {
  const res = await fetch(`${PUBLIC_API_BASE_URL}/users/me/avatar`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to delete avatar');
  }
  return res.json();
}

/**
 * Updates the user's password in the backend.
 * @param passwordData - The new password data.
 * @param token - The user's JWT.
 * @returns A promise that resolves to void.
 */
export const updateUserPassword = async (
  passwordData: UpdatePasswordRequest,
  token: string
): Promise<void> => {
  const res = await fetch(`${PUBLIC_API_BASE_URL}/users/me/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(passwordData),
  });

  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as ApiError;
    throw new Error(
      errorData.message || `Failed to update password: ${res.statusText}`
    );
  }
};

/**
 * Updates the user's profile (e.g., name).
 * @param profileData - The new profile data.
 * @param token - The user's JWT.
 * @returns A promise that resolves to the updated user object.
 */
export const updateUserProfile = async (
  profileData: UpdateProfileRequest,
  token: string
): Promise<User> => {
  const res = await fetch(`${PUBLIC_API_BASE_URL}/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as ApiError;
    throw new Error(
      errorData.message || `Failed to update profile: ${res.statusText}`
    );
  }
  return res.json();
};

/**
 * Fetches the user's activity data for the contribution graph.
 * @param token - The user's JWT.
 * @returns A promise that resolves to an array of activity data.
 */
export const getUserActivity = async (token: string): Promise<Activity[]> => {
  const res = await fetch(`${PUBLIC_API_BASE_URL}/users/me/activity`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch activity data');
  }
  return res.json();
};
