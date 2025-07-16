import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Banner from './Banner';

jest.mock('lucide-react', () => ({
  ...jest.requireActual('lucide-react'),
  CheckCircle2: () => <div data-testid="success-icon" />,
  XCircle: () => <div data-testid="error-icon" />,
  X: () => <div data-testid="close-icon" />,
}));

describe('Banner Component', () => {
  let onCloseMock: jest.Mock;

  beforeEach(() => {
    onCloseMock = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('正常系', () => {
    it('ケース1: コンポーネントが正しく表示され、メッセージが表示される', async () => {
      render(
        <Banner message="成功しました！" type="success" onClose={onCloseMock} />
      );

      const banner = screen.getByRole('alert');
      expect(banner).toHaveClass('opacity-0');

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(banner).toHaveClass('opacity-100');
      });
      expect(screen.getByText('成功しました！')).toBeInTheDocument();
    });

    it('ケース2: 閉じるボタンをクリックすると、onCloseコールバックが呼ばれる', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(
        <Banner message="エラーです" type="error" onClose={onCloseMock} />
      );

      act(() => {
        jest.advanceTimersByTime(100);
      });
      await screen.findByRole('alert');

      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      expect(onCloseMock).not.toHaveBeenCalled();

      jest.advanceTimersByTime(300);

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('異常系 / エッジケース', () => {
    it('ケース3: メッセージが空文字列の場合でもクラッシュしない', async () => {
      render(<Banner message="" type="success" onClose={onCloseMock} />);
      act(() => {
        jest.advanceTimersByTime(100);
      });

      const banner = await screen.findByRole('alert');
      expect(banner).toBeInTheDocument();
      const messageElement = banner.querySelector('.message');

      expect(messageElement).toBeInTheDocument();
      expect(messageElement?.textContent).toBe('');
    });

    it('ケース4: 表示アニメーション完了前にアンマウントされてもエラーが発生しない', () => {
      const { unmount } = render(
        <Banner message="テスト" type="success" onClose={onCloseMock} />
      );

      unmount();

      jest.runAllTimers();

      expect(onCloseMock).not.toHaveBeenCalled();
    });
  });

  describe('バリエーション', () => {
    it('ケース5: type="success"の場合、成功のスタイルとアイコンが表示される', async () => {
      render(<Banner message="成功" type="success" onClose={onCloseMock} />);
      act(() => {
        jest.advanceTimersByTime(100);
      });

      const banner = await screen.findByRole('alert');
      expect(banner).toHaveClass('bg-green-50', 'text-green-800');
      expect(screen.getByTestId('success-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('error-icon')).not.toBeInTheDocument();
    });

    it('ケース5: type="error"の場合、エラーのスタイルとアイコンが表示される', async () => {
      render(<Banner message="エラー" type="error" onClose={onCloseMock} />);
      act(() => {
        jest.advanceTimersByTime(100);
      });

      const banner = await screen.findByRole('alert');
      expect(banner).toHaveClass('bg-red-50', 'text-red-800');
      expect(screen.getByTestId('error-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('success-icon')).not.toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    it('ケース6: スクリーンリーダーのための属性が正しく設定されている', async () => {
      render(<Banner message="情報" type="success" onClose={onCloseMock} />);
      act(() => {
        jest.advanceTimersByTime(100);
      });

      await screen.findByRole('alert');

      expect(
        screen.getByRole('button', { name: /close/i })
      ).toBeInTheDocument();
    });
  });
});
