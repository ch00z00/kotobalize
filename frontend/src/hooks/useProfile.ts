'use client';

import { useState, ChangeEvent, useEffect, FormEvent } from 'react';
import { useAuthStore } from '@/store/auth';
import {
  getAvatarUploadUrl,
  updateUserAvatar,
  updateUserProfile,
  updateUserPassword,
  deleteUserAvatar,
  getUserActivity,
} from '@/lib/api/users.client';
import { type Activity } from 'react-activity-calendar';

/**
 * Custom hook to encapsulate all logic for the user profile page.
 * It handles state management, API calls, and event handlers.
 */
export const useProfilePage = () => {
  const { user, token, updateAvatar, updateUser } = useAuthStore();

  // State for file handling
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // General and specific loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isActivityLoading, setIsActivityLoading] = useState(true);

  // Modal visibility states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // State for profile editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState('');

  // State for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // State for contribution graph data
  const [activityData, setActivityData] = useState<Activity[]>([]);

  // State for user notifications
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Effect to sync local name state with the user from the auth store
  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  /* Helper function to wrap API calls with common logic and error handling.
   *
   * @param apiCall - The API call to wrap.
   * @param options - Options for the API call.
   * @param options.loadingSetter - Function to set the loading state.
   * @param options.successMessage - Success message to display.
   * @param options.onSuccess - Optional function to run on success.
   * @param options.genericErrorMessage - Generic error message to display.
   */
  const handleApiCall = async <T>(
    apiCall: () => Promise<T>,
    options: {
      loadingSetter: (isLoading: boolean) => void;
      successMessage: string;
      onSuccess?: (result: T) => void;
      genericErrorMessage: string;
    }
  ) => {
    options.loadingSetter(true);
    setNotification(null);
    try {
      const result = await apiCall();
      setNotification({ message: options.successMessage, type: 'success' });
      options.onSuccess?.(result);
    } catch (err) {
      setNotification({
        message:
          err instanceof Error ? err.message : options.genericErrorMessage,
        type: 'error',
      });
    } finally {
      options.loadingSetter(false);
    }
  };

  // Effect to fetch user activity data for the contribution graph
  useEffect(() => {
    const fetchActivity = async () => {
      if (token) {
        try {
          const data = await getUserActivity(token);
          setActivityData(data);
        } catch (err) {
          console.error('Failed to fetch activity data:', err);
          setNotification({
            message: '活動履歴の取得に失敗しました。',
            type: 'error',
          });
        } finally {
          setIsActivityLoading(false);
        }
      } else {
        // If no token, we are not fetching, so stop loading.
        setIsActivityLoading(false);
      }
    };
    fetchActivity();
  }, [token]);

  // Effect to automatically hide notifications after a delay
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };
  const handleCancelAvatarChange = () => {
    setFile(null);
    setPreview(null);
  };

  const handleUploadAvatar = async () => {
    if (!file || !token) return;

    await handleApiCall(
      async () => {
        const { uploadUrl } = await getAvatarUploadUrl(
          file.name,
          file.type,
          token
        );
        const s3Response = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });

        if (!s3Response.ok) {
          const errorText = await s3Response.text();
          throw new Error(
            `S3へのアップロードに失敗しました: ${s3Response.status}. ${errorText}`
          );
        }

        const avatarUrl = uploadUrl.split('?')[0];
        await updateUserAvatar(avatarUrl, token);
        return avatarUrl;
      },
      {
        loadingSetter: setIsLoading,
        successMessage: 'アバターを更新しました。',
        genericErrorMessage: 'アバターのアップロードに失敗しました。',
        onSuccess: (avatarUrl) => {
          updateAvatar(avatarUrl);
          handleCancelAvatarChange();
        },
      }
    );
  };

  const handleDeleteAvatar = async () => {
    if (!token || !user?.avatarUrl) return;

    await handleApiCall(() => deleteUserAvatar(token), {
      loadingSetter: setIsLoading,
      successMessage: 'アバターを削除しました。',
      genericErrorMessage: 'アバターの削除に失敗しました。',
      onSuccess: (updatedUser) => {
        updateAvatar(updatedUser.avatarUrl || '');
        setIsDeleteModalOpen(false);
      },
    });
  };

  const handleNameSave = async () => {
    if (!token || !name.trim()) {
      setNotification({ message: 'ユーザー名は必須です。', type: 'error' });
      return;
    }
    await handleApiCall(() => updateUserProfile({ name }, token), {
      loadingSetter: setIsLoading,
      successMessage: 'ユーザー名を更新しました。',
      genericErrorMessage: '更新に失敗しました。',
      onSuccess: (updatedUser) => {
        updateUser(updatedUser);
        setIsEditingName(false);
      },
    });
  };

  const handlePasswordChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    if (newPassword.length < 8) {
      setNotification({
        message: '新しいパスワードは8文字以上で入力してください。',
        type: 'error',
      });
      return;
    }

    await handleApiCall(
      () => updateUserPassword({ currentPassword, newPassword }, token),
      {
        loadingSetter: setIsPasswordLoading,
        successMessage: 'パスワードを更新しました。',
        genericErrorMessage: 'パスワードの変更に失敗しました。',
        onSuccess: () => {
          setCurrentPassword('');
          setNewPassword('');
          setIsPasswordModalOpen(false);
        },
      }
    );
  };

  return {
    user,
    file,
    setFile,
    preview,
    setPreview,
    isLoading,
    isPasswordLoading,
    isActivityLoading,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    isEditingName,
    setIsEditingName,
    name,
    setName,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    activityData,
    notification,
    setNotification,
    handleAvatarChange,
    handleCancelAvatarChange,
    handleUploadAvatar,
    handleDeleteAvatar,
    handleNameSave,
    handlePasswordChange,
  };
};
