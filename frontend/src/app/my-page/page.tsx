'use client';

import { User, Mail, Edit3, Save } from 'lucide-react';
import Image from 'next/image';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Button from '@/components/atoms/Button';
import DeleteModal from '@/components/organisms/DeleteModal';
import Banner from '@/components/molecules/Banner';
import Modal from '@/components/common/Modal';
import ContributionGraph from '@/components/organisms/ContributionGraph';
import { useProfilePage } from '@/hooks/useProfile';
export default function ProfilePage() {
  const {
    user,
    file,
    preview,
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
    handleUploadAvatar,
    handleCancelAvatarChange,
    handleDeleteAvatar,
    handleNameSave,
    handlePasswordChange,
  } = useProfilePage();

  return (
    <ProtectedRoute>
      {notification && (
        <Banner
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div>
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
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {file && (
                <div className="flex w-full items-center justify-center space-x-4">
                  <Button onClick={handleUploadAvatar} disabled={isLoading}>
                    {isLoading ? '保存中...' : '保存'}
                  </Button>
                  <Button onClick={handleCancelAvatarChange} variant="outline">
                    キャンセル
                  </Button>
                </div>
              )}

              <div className="w-full text-center">
                <div className="group flex items-center justify-center gap-2 -mr-5">
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
            <div className="rounded-xl bg-white p-6 border-2 border-gray-200">
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
        message={'本当にアバターを削除しますか？\nこの操作は元に戻せません。'}
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
