import { renderHook, act, waitFor } from '@testing-library/react';
import { useProfilePage } from './useProfile';
import { useAuthStore } from '@/store/auth';
import { useAvatar } from './useAvatar';
import * as usersApi from '@/lib/api/users.client';
import { User } from '@/types/generated/api';
import { FormEvent } from 'react';

// 依存関係のモック化
jest.mock('@/store/auth');
jest.mock('./useAvatar');
jest.mock('@/lib/api/users.client');

// モックの型付け
const mockedUseAuthStore = useAuthStore as unknown as jest.Mock;
const mockedUseAvatar = useAvatar as jest.Mock;
const mockedUsersApi = usersApi as jest.Mocked<typeof usersApi>;

describe('useProfilePage', () => {
  const mockUpdateUser = jest.fn();
  const mockAvatarNotificationSetter = jest.fn();

  const testUser: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    avatarUrl: 'http://example.com/avatar.png',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // デフォルトのモック実装
    mockedUseAuthStore.mockReturnValue({
      user: testUser,
      token: 'test-token',
      updateUser: mockUpdateUser,
    });

    mockedUseAvatar.mockReturnValue({
      file: null,
      preview: null,
      isAvatarLoading: false,
      handleAvatarChange: jest.fn(),
      handleCancelAvatarChange: jest.fn(),
      handleUploadAvatar: jest.fn(),
      handleDeleteAvatar: jest.fn(),
      notificationSetter: mockAvatarNotificationSetter,
    });

    mockedUsersApi.getUserActivity.mockResolvedValue([]);
  });

  it('ケース1: 初期化時にユーザーデータを正しく設定し、活動履歴を取得すること', async () => {
    const { result } = renderHook(() => useProfilePage());

    // 初期値の確認 (nameはuseEffectですぐに設定される)
    expect(result.current.name).toBe('Test User');
    expect(result.current.isActivityLoading).toBe(true);

    // 非同期な活動履歴の取得が完了し、最終的な状態になるのを待つ
    await waitFor(() => {
      expect(result.current.isActivityLoading).toBe(false);
      expect(mockedUsersApi.getUserActivity).toHaveBeenCalledWith('test-token');
    });
  });

  it('ケース2: 活動履歴の取得に失敗した場合、エラー通知が表示されること', async () => {
    // console.errorがテスト中に呼び出されることを想定しているため、モック化して出力を抑制する
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const error = new Error('Fetch failed');
    mockedUsersApi.getUserActivity.mockRejectedValue(error);

    const { result } = renderHook(() => useProfilePage());

    // 非同期な活動履歴の取得が失敗し、最終的な状態になるのを待つ
    await waitFor(() => {
      expect(result.current.isActivityLoading).toBe(false);
      expect(result.current.notification).toEqual({
        message: '活動履歴の取得に失敗しました。',
        type: 'error',
      });
    });
    // スパイをリストアして、他のテストに影響が出ないようにする
    consoleErrorSpy.mockRestore();
  });

  describe('handleNameSave', () => {
    it('ケース3: ユーザー名の更新に成功すること', async () => {
      const { result } = renderHook(() => useProfilePage());
      const newName = 'New Name';
      const updatedUser = { ...testUser, name: newName };
      mockedUsersApi.updateUserProfile.mockResolvedValue(updatedUser);

      act(() => {
        result.current.setName(newName);
      });

      await act(async () => {
        await result.current.handleNameSave();
      });

      expect(mockedUsersApi.updateUserProfile).toHaveBeenCalledWith(
        { name: newName },
        'test-token'
      );
      expect(mockUpdateUser).toHaveBeenCalledWith(updatedUser);
      expect(result.current.isEditingName).toBe(false);
      expect(result.current.notification).toEqual({
        message: 'ユーザー名を更新しました。',
        type: 'success',
      });
    });

    it('ケース4: ユーザー名が空の場合、エラー通知を表示すること', async () => {
      const { result } = renderHook(() => useProfilePage());

      act(() => {
        result.current.setName('  '); // 空白のみ
      });

      await act(async () => {
        await result.current.handleNameSave();
      });

      expect(mockedUsersApi.updateUserProfile).not.toHaveBeenCalled();
      expect(result.current.notification).toEqual({
        message: 'ユーザー名は必須です。',
        type: 'error',
      });
    });

    it('ケース5: ユーザー名の更新に失敗した場合、エラー通知を表示すること', async () => {
      const error = new Error('Update failed');
      mockedUsersApi.updateUserProfile.mockRejectedValue(error);
      const { result } = renderHook(() => useProfilePage());

      act(() => {
        result.current.setName('New Name');
      });

      await act(async () => {
        await result.current.handleNameSave();
      });

      expect(mockUpdateUser).not.toHaveBeenCalled();
      expect(result.current.notification).toEqual({
        message: 'Update failed',
        type: 'error',
      });
    });
  });

  describe('handlePasswordChange', () => {
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as FormEvent<HTMLFormElement>;

    it('ケース6: パスワードの更新に成功すること', async () => {
      mockedUsersApi.updateUserPassword.mockResolvedValue(undefined);
      const { result } = renderHook(() => useProfilePage());

      act(() => {
        result.current.setCurrentPassword('old-password');
        result.current.setNewPassword('new-password-long-enough');
      });

      await act(async () => {
        await result.current.handlePasswordChange(mockEvent);
      });

      expect(mockedUsersApi.updateUserPassword).toHaveBeenCalledWith(
        {
          currentPassword: 'old-password',
          newPassword: 'new-password-long-enough',
        },
        'test-token'
      );
      expect(result.current.isPasswordModalOpen).toBe(false);
      expect(result.current.notification).toEqual({
        message: 'パスワードを更新しました。',
        type: 'success',
      });
    });

    it('ケース7: 新しいパスワードが8文字未満の場合、エラー通知を表示すること', async () => {
      const { result } = renderHook(() => useProfilePage());

      act(() => {
        result.current.setNewPassword('short');
      });

      await act(async () => {
        await result.current.handlePasswordChange(mockEvent);
      });

      expect(mockedUsersApi.updateUserPassword).not.toHaveBeenCalled();
      expect(result.current.notification).toEqual({
        message: '新しいパスワードは8文字以上で入力してください。',
        type: 'error',
      });
    });
  });

  it('ケース8: useAvatarのonDeleteSuccessコールバックでモーダルを閉じること', () => {
    const { result } = renderHook(() => useProfilePage());
    const { onDeleteSuccess } = mockedUseAvatar.mock.calls[0][0];

    act(() => {
      result.current.setIsDeleteModalOpen(true);
    });
    expect(result.current.isDeleteModalOpen).toBe(true);

    act(() => {
      onDeleteSuccess();
    });
    expect(result.current.isDeleteModalOpen).toBe(false);
  });
});
