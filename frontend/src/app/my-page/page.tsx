'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { User, Mail, Edit3, Save } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/store/auth';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Button from '@/components/atoms/Button';
import {
  getAvatarUploadUrl,
  updateUserAvatar,
  updateUserProfile,
  updateUserPassword,
  deleteUserAvatar,
  getUserActivity,
} from '@/lib/api/users.client';
import DeleteModal from '@/components/organisms/DeleteModal';
import Banner from '@/components/molecules/Banner';
import Modal from '@/components/common/Modal';
import ContributionGraph from '@/components/organisms/ContributionGraph';
import { type Activity } from 'react-activity-calendar';

export default function ProfilePage() {
  const { user, token, updateAvatar, updateUser } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // State for profile editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user?.name || '');

  // State for password change
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // State for contribution graph
  const [activityData, setActivityData] = useState<Activity[]>([]);
  const [isActivityLoading, setIsActivityLoading] = useState(true);

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

  const handleNameSave = async () => {
    if (!token || !name.trim()) {
      setNotification({
        message: 'ユーザー名は必須です。',
        type: 'error',
      });
      return;
    }
    setIsLoading(true);
    try {
      const updatedUser = await updateUserProfile({ name }, token);
      updateUser(updatedUser); // Update user in the store
      setNotification({
        message: 'ユーザー名を更新しました。',
        type: 'success',
      });
      setIsEditingName(false);
    } catch (err) {
      setNotification({
        message: err instanceof Error ? err.message : '更新に失敗しました。',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    if (newPassword.length < 8) {
      setNotification({
        message: '新しいパスワードは8文字以上で入力してください。',
        type: 'error',
      });
      return;
    }

    setIsPasswordLoading(true);
    setNotification(null);

    try {
      await updateUserPassword({ currentPassword, newPassword }, token);
      setNotification({
        message: 'パスワードを更新しました。',
        type: 'success',
      });
      setCurrentPassword('');
      setNewPassword('');
      setIsPasswordModalOpen(false);
    } catch (err) {
      setNotification({
        message:
          err instanceof Error
            ? err.message
            : 'パスワードの変更に失敗しました。',
        type: 'error',
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

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
      }
    };
    fetchActivity();
  }, [token]);

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
      <div className="container mx-auto min-h-[calc(100vh-168px)] max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Left Sidebar */}
          <aside className="md:col-span-1">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-40 w-40">
                <div className="group relative h-full w-full">
                  <div className="h-full w-full overflow-hidden rounded-full border-4 border-gray-200 bg-gray-200">
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
                      <User className="h-full w-full p-8 text-gray-400" />
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    変更
                  </label>
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {file && (
                <div className="flex w-full items-center justify-center space-x-4">
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? '保存中...' : '保存'}
                  </Button>
                  <Button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    variant="outline"
                  >
                    キャンセル
                  </Button>
                </div>
              )}

              <div className="w-full text-center">
                <div className="group flex items-center justify-center gap-2">
                  {isEditingName ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-md border-2 border-gray-300 text-center text-2xl font-bold"
                      autoFocus
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user?.name || 'ユーザー名未設定'}
                    </h1>
                  )}
                  {isEditingName ? (
                    <button
                      onClick={handleNameSave}
                      className="text-gray-500 hover:text-primary"
                    >
                      <Save className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Edit3 className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <p className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </p>
              </div>

              <div className="w-full space-y-2 pt-4">
                <Button
                  onClick={() => setIsPasswordModalOpen(true)}
                  variant="outline"
                  className="w-full"
                >
                  パスワードを変更
                </Button>
                {user?.avatarUrl && (
                  <Button
                    onClick={() => setIsDeleteModalOpen(true)}
                    variant="danger"
                    className="w-full"
                  >
                    アバターを削除
                  </Button>
                )}
              </div>
            </div>
          </aside>

          {/* Right Content */}
          <main className="md:col-span-3">
            <div className="rounded-xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-gray-700">
                Contributions
              </h2>
              {isActivityLoading ? (
                <div className="h-[160px] w-full animate-pulse rounded-md bg-gray-200" />
              ) : (
                <ContributionGraph data={activityData} />
              )}
            </div>
          </main>
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
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      >
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-xl font-bold text-gray-800">
            パスワード変更
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-medium text-gray-700"
              >
                現在のパスワード
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border-2 border-gray-300 bg-gray-100 py-2 px-3 sm:text-md"
                autoComplete="current-password"
              />
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700"
              >
                新しいパスワード (8文字以上)
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border-2 border-gray-300 bg-gray-100 py-2 px-3 sm:text-md"
                autoComplete="new-password"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                variant="outline"
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={isPasswordLoading}>
                {isPasswordLoading ? '変更中...' : 'パスワードを変更'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </ProtectedRoute>
  );
}
