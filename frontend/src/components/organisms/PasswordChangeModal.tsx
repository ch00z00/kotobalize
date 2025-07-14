'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { updateUserPassword } from '@/lib/api/users.client';
import Modal from '@/components/common/Modal';
import Button from '@/components/atoms/Button';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function PasswordChangeModal({
  isOpen,
  onClose,
  onSuccess,
  onError,
}: PasswordChangeModalProps) {
  const { token } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      onError('認証エラーが発生しました。');
      return;
    }
    if (newPassword.length < 8) {
      onError('新しいパスワードは8文字以上で入力してください。');
      return;
    }

    setIsLoading(true);

    try {
      await updateUserPassword({ currentPassword, newPassword }, token);
      onSuccess();
      setCurrentPassword('');
      setNewPassword('');
      onClose();
    } catch (err) {
      onError(
        err instanceof Error ? err.message : 'パスワードの変更に失敗しました。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when modal is closed
  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-gray-800">パスワード変更</h2>
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
            <Button type="button" onClick={handleClose} variant="outline">
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '変更中...' : 'パスワードを変更'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
