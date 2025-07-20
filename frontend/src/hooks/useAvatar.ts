'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import {
  getAvatarUploadUrl,
  updateUserAvatar,
  deleteUserAvatar,
} from '@/lib/api/users.client';

/**
 * Notification message type definition
 */
type NotificationType = {
  message: string;
  type: 'success' | 'error';
};

/**
 * Props for the useAvatar hook
 */
interface UseAvatarProps {
  onDeleteSuccess?: () => void; // Callback to run on avatar deletion success
}

/**
 * Custom hook to encapsulate user avatar-related logic
 * @param {UseAvatarProps} props - Hook properties
 */
export const useAvatar = ({ onDeleteSuccess }: UseAvatarProps = {}) => {
  const { user, token, updateAvatar } = useAuthStore();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [avatarNotification, setAvatarNotification] =
    useState<NotificationType | null>(null);

  useEffect(() => {
    if (avatarNotification) {
      const timer = setTimeout(() => {
        setAvatarNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [avatarNotification]);

  /**
   * Handle file input changes and set file and preview
   * @param e - ChangeEvent
   */
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  /**
   * Cancel avatar change and reset file and preview
   */
  const handleCancelAvatarChange = () => {
    setFile(null);
    setPreview(null);
  };

  /**
   * Upload a new avatar
   */
  const handleUploadAvatar = async () => {
    if (!file || !token) return;

    setIsAvatarLoading(true);
    setAvatarNotification(null);
    try {
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
      updateAvatar(avatarUrl); // Zustandストアを更新
      handleCancelAvatarChange(); // ファイルとプレビューをリセット
      setAvatarNotification({
        message: 'アバターを更新しました。',
        type: 'success',
      });
    } catch (err) {
      setAvatarNotification({
        message:
          err instanceof Error
            ? err.message
            : 'アバターのアップロードに失敗しました。',
        type: 'error',
      });
    } finally {
      setIsAvatarLoading(false);
    }
  };

  /**
   * Delete the current avatar
   */
  const handleDeleteAvatar = async () => {
    if (!token || !user?.avatarUrl) return;

    setIsAvatarLoading(true);
    setAvatarNotification(null);
    try {
      const updatedUser = await deleteUserAvatar(token);
      updateAvatar(updatedUser.avatarUrl || ''); // Zustandストアを更新
      setAvatarNotification({
        message: 'アバターを削除しました。',
        type: 'success',
      });
      onDeleteSuccess?.(); // 親コンポーネントに成功を通知（例：モーダルを閉じる）
    } catch (err) {
      setAvatarNotification({
        message:
          err instanceof Error ? err.message : 'アバターの削除に失敗しました。',
        type: 'error',
      });
    } finally {
      setIsAvatarLoading(false);
    }
  };

  return {
    file,
    preview,
    isAvatarLoading,
    avatarNotification,
    setAvatarNotification,
    handleAvatarChange,
    handleCancelAvatarChange,
    handleUploadAvatar,
    handleDeleteAvatar,
  };
};
