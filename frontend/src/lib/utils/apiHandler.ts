import { Dispatch, SetStateAction } from 'react';

type NotificationType = {
  message: string;
  type: 'success' | 'error';
};

/**
 * API呼び出しをラップし、ローディング状態と通知を管理する共通ヘルパー関数
 * @param apiCall 実行するAPI呼び出しのPromise
 * @param options API呼び出しのオプション
 */
export const handleApiCall = async <T>(
  apiCall: () => Promise<T>,
  options: {
    loadingSetter: Dispatch<SetStateAction<boolean>>;
    notificationSetter: Dispatch<SetStateAction<NotificationType | null>>;
    successMessage: string;
    onSuccess?: (result: T) => void;
    genericErrorMessage: string;
  }
) => {
  options.loadingSetter(true);
  options.notificationSetter(null);
  try {
    const result = await apiCall();
    options.notificationSetter({
      message: options.successMessage,
      type: 'success',
    });
    options.onSuccess?.(result);
  } catch (err) {
    options.notificationSetter({
      message: err instanceof Error ? err.message : options.genericErrorMessage,
      type: 'error',
    });
  } finally {
    options.loadingSetter(false);
  }
};
