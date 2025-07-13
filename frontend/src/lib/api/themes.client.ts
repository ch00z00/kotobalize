import {
  ApiError,
  NewThemeRequest,
  Theme,
  UpdateThemeRequest,
} from '@/types/generated/api';
import { PUBLIC_API_BASE_URL } from '@/lib/api/config';

/**
 * Creates a new theme.
 * This function is designed to be called from the client-side and requires authentication.
 * @param themeData - The data for the new theme.
 * @param token - The authentication token.
 * @returns A promise that resolves to the newly created theme.
 */
export async function createTheme(
  themeData: NewThemeRequest,
  token: string
): Promise<Theme> {
  console.log('createTheme called with:', themeData);
  const res = await fetch(`${PUBLIC_API_BASE_URL}/themes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(themeData),
  });

  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as ApiError;
    throw new Error(
      errorData.message || `Failed to create theme: ${res.statusText}`
    );
  }

  // The 'Theme' interface from api.ts has string dates, so we return it directly.
  return res.json();
}

/**
 * Fetches a list of all available themes from the backend API.
 * This function is designed to be called from the client-side (browser).
 * @param token - The user's JWT for authorization.
 * @returns A promise that resolves to an array of themes.
 */
export async function getThemesForClient(token: string): Promise<Theme[]> {
  try {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/themes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch themes: ${res.statusText}`);
    }

    // The 'Theme' interface from api.ts has string dates, so we return it directly.
    return res.json();
  } catch (error) {
    console.error('API call failed:', error);
    // Return an empty array on error to prevent the page from crashing.
    return [];
  }
}

export const updateTheme = async (
  themeId: number,
  themeData: UpdateThemeRequest,
  token: string
): Promise<Theme> => {
  const res = await fetch(`${PUBLIC_API_BASE_URL}/themes/${themeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(themeData),
  });

  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as ApiError;
    throw new Error(
      errorData.message || `Failed to update theme: ${res.statusText}`
    );
  }

  // The 'Theme' interface from api.ts has string dates, so we return it directly.
  return res.json();
};

export const deleteTheme = async (
  themeId: number,
  token: string
): Promise<void> => {
  const res = await fetch(`${PUBLIC_API_BASE_URL}/themes/${themeId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    // 204 No Contentはok=trueなのでここには来ない。4xx, 5xxエラーの場合。
    const errorData = (await res.json().catch(() => ({}))) as ApiError;
    throw new Error(
      errorData.message || `Failed to delete theme: ${res.statusText}`
    );
  }
};

/**
 * Add a theme to favorites.
 * @param themeId The ID of the theme to favorite.
 * @param token The user's JWT.
 */
export const favoriteTheme = async (
  themeId: number,
  token: string
): Promise<void> => {
  const res = await fetch(`${PUBLIC_API_BASE_URL}/themes/${themeId}/favorite`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as ApiError;
    throw new Error(
      errorData.message || `Failed to favorite theme: ${res.statusText}`
    );
  }
};

/**
 * Remove a theme from favorites.
 * @param themeId The ID of the theme to unfavorite.
 * @param token The user's JWT.
 */
export const unfavoriteTheme = async (
  themeId: number,
  token: string
): Promise<void> => {
  const res = await fetch(`${PUBLIC_API_BASE_URL}/themes/${themeId}/favorite`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as ApiError;
    throw new Error(
      errorData.message || `Failed to unfavorite theme: ${res.statusText}`
    );
  }
};
