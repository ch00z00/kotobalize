'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { User } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/store/auth';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Button from '@/components/atoms/Button';
import {
  getAvatarUploadUrl,
  updateUserAvatar,
  deleteUserAvatar,
} from '@/lib/api/users.client';
import DeleteModal from '@/components/organisms/DeleteModal';
import Banner from '@/components/molecules/Banner';

export default function ProfilePage() {
  const { user, token, updateAvatar } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!file || !token) return;

    setIsLoading(true);
    setNotification(null);

    try {
      // 1. Get presigned URL from our backend
      const { uploadUrl } = await getAvatarUploadUrl(
        file.name,
        file.type,
        token
      );

      // 2. Upload file directly to S3
      const s3Response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!s3Response.ok) {
        // S3からのエラーレスポンス(XML)をテキストとして取得し、より詳細なエラーを表示
        const errorText = await s3Response.text();
        throw new Error(
          `S3へのアップロードに失敗しました: ${s3Response.status}. ${errorText}`
        );
      }

      // 3. Notify our backend with the new avatar URL
      const avatarUrl = uploadUrl.split('?')[0]; // The base URL is the final URL
      await updateUserAvatar(avatarUrl, token);

      // 4. Update local state
      updateAvatar(avatarUrl);
      setNotification({ message: 'アバターを更新しました。', type: 'success' });
      setFile(null);
      setPreview(null);
    } catch (err) {
      setNotification({
        message: err instanceof Error ? err.message : 'Upload failed',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!token || !user?.avatarUrl) return;

    setIsLoading(true);
    setNotification(null);
    try {
      const updatedUser = await deleteUserAvatar(token);
      updateAvatar(updatedUser.avatarUrl || '');
      setNotification({ message: 'アバターを削除しました。', type: 'success' });
    } catch (err) {
      setNotification({
        message:
          err instanceof Error ? err.message : 'アバターの削除に失敗しました。',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <ProtectedRoute>
      {notification && (
        <Banner
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="container mx-auto min-h-[calc(100vh-168px)] py-12 px-4">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">PROFILE</h1>
        <div className="max-w-md rounded-xl bg-white p-8 shadow-md">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative h-32 w-32">
              <div className="h-full w-full overflow-hidden rounded-full bg-gray-200">
                {preview ? (
                  <Image
                    src={preview}
                    width={320}
                    height={320}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    width={320}
                    height={320}
                    alt="Current avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-full w-full p-5 text-gray-400" />
                )}
              </div>
            </div>

            <input
              id="avatar-upload"
              type="file"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20"
            />

            <div className="flex w-full items-center justify-center space-x-4">
              {user?.avatarUrl && (
                <Button
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={isLoading}
                  variant="danger"
                >
                  削除
                </Button>
              )}
              <Button onClick={handleSubmit} disabled={!file || isLoading}>
                {isLoading ? '変更中...' : 'アバターを変更'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAvatar}
        title="アバターの削除"
        message="本当にアバターを削除しますか？この操作は元に戻せません。"
        isLoading={isLoading}
      />
    </ProtectedRoute>
  );
}
