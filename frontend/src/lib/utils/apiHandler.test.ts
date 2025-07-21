import { handleApiCall } from './apiHandler';

describe('handleApiCall', () => {
  // モック関数を各テストケースで再利用するために定義
  const loadingSetter = jest.fn();
  const notificationSetter = jest.fn();
  const onSuccess = jest.fn();

  // 各テストの前にモックをクリア
  beforeEach(() => {
    loadingSetter.mockClear();
    notificationSetter.mockClear();
    onSuccess.mockClear();
  });

  const successMessage = '成功しました！';
  const genericErrorMessage = 'エラーが発生しました。';

  it('ケース1: API呼び出しが成功した場合、ローディングと成功通知が正しく設定されること', async () => {
    // 成功するAPI呼び出しをモック
    const apiCall = jest.fn().mockResolvedValue('成功データ');

    await handleApiCall(apiCall, {
      loadingSetter,
      notificationSetter,
      successMessage,
      onSuccess,
      genericErrorMessage,
    });

    // ローディング状態が true -> false の順で呼ばれることを確認
    expect(loadingSetter).toHaveBeenCalledWith(true);
    expect(loadingSetter).toHaveBeenCalledWith(false);
    expect(loadingSetter).toHaveBeenCalledTimes(2);

    // 通知が null -> 成功メッセージ の順で呼ばれることを確認
    expect(notificationSetter).toHaveBeenCalledWith(null);
    expect(notificationSetter).toHaveBeenCalledWith({
      message: successMessage,
      type: 'success',
    });
    expect(notificationSetter).toHaveBeenCalledTimes(2);

    // onSuccessコールバックがAPIの返り値と共に呼ばれることを確認
    expect(onSuccess).toHaveBeenCalledWith('成功データ');
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('ケース2: API呼び出しがErrorオブジェクトで失敗した場合、エラーメッセージが正しく設定されること', async () => {
    const errorMessage = 'APIの呼び出しに失敗しました';
    // 失敗するAPI呼び出しをモック
    const apiCall = jest.fn().mockRejectedValue(new Error(errorMessage));

    await handleApiCall(apiCall, {
      loadingSetter,
      notificationSetter,
      successMessage,
      onSuccess,
      genericErrorMessage,
    });

    // ローディング状態が正しく更新されることを確認
    expect(loadingSetter).toHaveBeenCalledWith(true);
    expect(loadingSetter).toHaveBeenCalledWith(false);

    // 通知がErrorオブジェクトのメッセージで設定されることを確認
    expect(notificationSetter).toHaveBeenCalledWith({
      message: errorMessage,
      type: 'error',
    });

    // onSuccessは呼ばれないことを確認
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('ケース3: API呼び出しがErrorオブジェクト以外で失敗した場合、汎用エラーメッセージが設定されること', async () => {
    // Errorオブジェクト以外で失敗するAPI呼び出しをモック
    const apiCall = jest.fn().mockRejectedValue('文字列エラー');

    await handleApiCall(apiCall, {
      loadingSetter,
      notificationSetter,
      successMessage,
      onSuccess,
      genericErrorMessage,
    });

    // ローディング状態が正しく更新されることを確認
    expect(loadingSetter).toHaveBeenCalledWith(true);
    expect(loadingSetter).toHaveBeenCalledWith(false);

    // 通知が汎用エラーメッセージで設定されることを確認
    expect(notificationSetter).toHaveBeenCalledWith({
      message: genericErrorMessage,
      type: 'error',
    });

    // onSuccessは呼ばれないことを確認
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
