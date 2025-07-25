'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuthStore } from '@/store/auth';
import {
  updateUserProfile,
  updateUserPassword,
  getUserActivity,
} from '@/lib/api/users.client';
import { type Activity } from 'react-activity-calendar';
import { useAvatar } from './useAvatar';
import { handleApiCall } from '@/lib/utils/apiHandler';

/**
 * Custom hook to encapsulate all logic for the user profile page.
 * It handles state management, API calls, and event handlers.
 */
export const useProfilePage = () => {
  const { user, token, updateUser } = useAuthStore();

  // General and specific loading states
  // Note: isAvatarLoading is managed within the useAvatar hook.
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

  // Encapsulated avatar logic from the custom useAvatar hook
  const {
    file,
    preview,
    isAvatarLoading,
    handleAvatarChange,
    handleCancelAvatarChange,
    handleUploadAvatar,
    handleDeleteAvatar,
  } = useAvatar({
    onDeleteSuccess: () => setIsDeleteModalOpen(false),
    notificationSetter: setNotification,
  });

  // Effect to sync local name state with the user from the auth store
  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

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

  const handleNameSave = async () => {
    if (!token || !name.trim()) {
      setNotification({ message: 'ユーザー名は必須です。', type: 'error' });
      return;
    }
    await handleApiCall(() => updateUserProfile({ name }, token), {
      loadingSetter: setIsLoading,
      notificationSetter: setNotification,
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
        notificationSetter: setNotification,
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
    // Avatar related state and handlers from useAvatar
    file,
    preview,
    // Combine loading states for a single loading indicator in the UI
    isLoading: isLoading || isAvatarLoading,
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
    notification, // For profile updates
    setNotification,
    handleAvatarChange,
    handleCancelAvatarChange,
    handleUploadAvatar,
    handleDeleteAvatar,
    handleNameSave,
    handlePasswordChange,
  };
};
