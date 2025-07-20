import { renderHook, act } from '@testing-library/react';
import { useAvatar } from './useAvatar';
import { useAuthStore } from '@/store/auth';
import * as usersApi from '@/lib/api/users.client';
import { User } from '@/types/generated/api';

// 依存関係のモック化
jest.mock('@/store/auth');
jest.mock('@/lib/api/users.client');

// モックの型付け
const mockedUseAuthStore = useAuthStore as unknown as jest.Mock;
const mockedUsersApi = usersApi as jest.Mocked<typeof usersApi>;

describe('useAvatar', () => {
  const mockUpdateAvatar = jest.fn();
  const mockNotificationSetter = jest.fn();
  const mockOnDeleteSuccess = jest.fn();

  // グローバルなfetchとURL.createObjectURLをモック
  const originalFetch = global.fetch;
  const originalCreateObjectURL = global.URL.createObjectURL;

  beforeEach(() => {
    // 各テストの前にモックをリセット
    jest.clearAllMocks();

    // デフォルトのモック実装
    mockedUseAuthStore.mockReturnValue({
      user: { name: 'Test User', avatarUrl: 'http://example.com/avatar.png' },
      token: 'test-token',
      updateAvatar: mockUpdateAvatar,
    });

    global.URL.createObjectURL = jest.fn(
      () => 'blob:http://localhost/mock-url'
    );
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(''),
      })
    ) as jest.Mock;
  });

  afterAll(() => {
    // テスト後にグローバルなモックを元に戻す
    global.fetch = originalFetch;
    global.URL.createObjectURL = originalCreateObjectURL;
  });

  const renderAvatarHook = () =>
    renderHook(() =>
      useAvatar({
        notificationSetter: mockNotificationSetter,
        onDeleteSuccess: mockOnDeleteSuccess,
      })
    );

  it('ケース1: 初期状態が正しいこと', () => {
    const { result } = renderAvatarHook();

    expect(result.current.file).toBeNull();
    expect(result.current.preview).toBeNull();
    expect(result.current.isAvatarLoading).toBe(false);
  });

  it('ケース2: handleAvatarChangeでファイルとプレビューがセットされること', () => {
    const { result } = renderAvatarHook();
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });

    act(() => {
      result.current.handleAvatarChange({
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.file).toBe(file);
    expect(result.current.preview).toBe('blob:http://localhost/mock-url');
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
  });

  it('ケース3: handleCancelAvatarChangeでファイルとプレビューがリセットされること', () => {
    const { result } = renderAvatarHook();
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });

    act(() => {
      result.current.handleAvatarChange({
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleCancelAvatarChange();
    });

    expect(result.current.file).toBeNull();
    expect(result.current.preview).toBeNull();
  });

  describe('handleUploadAvatar', () => {
    it('ケース4: アバターのアップロードに成功すること', async () => {
      const { result } = renderAvatarHook();
      const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
      const uploadUrl = 'http://s3.com/upload?sig=123';
      const finalAvatarUrl = 'http://s3.com/upload';

      mockedUsersApi.getAvatarUploadUrl.mockResolvedValue({
        uploadUrl,
        key: 'test-key',
      });

      act(() => {
        result.current.handleAvatarChange({
          target: { files: [file] },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      });

      await act(async () => {
        await result.current.handleUploadAvatar();
      });

      expect(result.current.isAvatarLoading).toBe(false);
      expect(mockedUsersApi.getAvatarUploadUrl).toHaveBeenCalledWith(
        file.name,
        file.type,
        'test-token'
      );
      expect(global.fetch).toHaveBeenCalledWith(uploadUrl, expect.any(Object));
      expect(mockedUsersApi.updateUserAvatar).toHaveBeenCalledWith(
        finalAvatarUrl,
        'test-token'
      );
      expect(mockUpdateAvatar).toHaveBeenCalledWith(finalAvatarUrl);
      expect(mockNotificationSetter).toHaveBeenCalledWith({
        message: 'アバターを更新しました。',
        type: 'success',
      });
      expect(result.current.file).toBeNull();
    });

    it('ケース5: S3へのアップロードに失敗した場合、エラー通知が表示されること', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          text: () => Promise.resolve('S3 Error'),
        })
      ) as jest.Mock;

      const { result } = renderAvatarHook();
      const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
      mockedUsersApi.getAvatarUploadUrl.mockResolvedValue({
        uploadUrl: 'http://s3.com/upload',
        key: 'test-key',
      });

      act(() => {
        result.current.handleAvatarChange({
          target: { files: [file] },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      });

      await act(async () => {
        await result.current.handleUploadAvatar();
      });

      expect(mockNotificationSetter).toHaveBeenCalledWith({
        message: expect.stringContaining('S3へのアップロードに失敗しました'),
        type: 'error',
      });
      expect(mockUpdateAvatar).not.toHaveBeenCalled();
    });
  });

  describe('handleDeleteAvatar', () => {
    it('ケース6: アバターの削除に成功すること', async () => {
      const mockUpdatedUser: User = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: undefined,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };
      mockedUsersApi.deleteUserAvatar.mockResolvedValue(mockUpdatedUser);
      const { result } = renderAvatarHook();

      await act(async () => {
        await result.current.handleDeleteAvatar();
      });

      expect(result.current.isAvatarLoading).toBe(false);
      expect(mockedUsersApi.deleteUserAvatar).toHaveBeenCalledWith(
        'test-token'
      );
      expect(mockUpdateAvatar).toHaveBeenCalledWith('');
      expect(mockNotificationSetter).toHaveBeenCalledWith({
        message: 'アバターを削除しました。',
        type: 'success',
      });
      expect(mockOnDeleteSuccess).toHaveBeenCalledTimes(1);
    });

    it('ケース7: アバターの削除に失敗した場合、エラー通知が表示されること', async () => {
      const error = new Error('Deletion failed');
      mockedUsersApi.deleteUserAvatar.mockRejectedValue(error);
      const { result } = renderAvatarHook();

      await act(async () => {
        await result.current.handleDeleteAvatar();
      });

      expect(mockNotificationSetter).toHaveBeenCalledWith({
        message: 'Deletion failed',
        type: 'error',
      });
      expect(mockUpdateAvatar).not.toHaveBeenCalled();
      expect(mockOnDeleteSuccess).not.toHaveBeenCalled();
    });
  });
});
