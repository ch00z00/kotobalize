'use client';

import { useState, ChangeEvent } from 'react';
import { useAuthStore } from '@/store/auth';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Button from '@/components/atoms/Button';
import { getAvatarUploadUrl, updateUserAvatar } from '@/lib/api/users.client';

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-full w-full text-gray-400"
    >
      <path
        fillRule="evenodd"
        d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function ProfilePage() {
  const { user, token, updateAvatar } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);

    try {
      // 1. Get presigned URL from our backend
      const { uploadUrl } = await getAvatarUploadUrl(
        file.name,
        file.type,
        token
      );

      // 2. Upload file directly to S3
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      // 3. Notify our backend with the new avatar URL
      const avatarUrl = uploadUrl.split('?')[0]; // The base URL is the final URL
      await updateUserAvatar(avatarUrl, token);

      // 4. Update local state
      updateAvatar(avatarUrl);
      alert('アバターを更新しました。');
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto min-h-[calc(100vh-168px)] py-12 px-4">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">PROFILE</h1>
        <div className="max-w-md rounded-xl bg-white p-8 shadow-md">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative h-32 w-32">
              <div className="h-full w-full overflow-hidden rounded-full bg-gray-200">
                {preview ? (
                  <img
                    src={preview}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="Current avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon />
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

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button onClick={handleSubmit} disabled={!file || isLoading}>
              {isLoading ? '更新中...' : 'アバターを更新'}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
