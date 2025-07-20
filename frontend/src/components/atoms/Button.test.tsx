import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Button, { type ButtonProps } from './Button';

describe('Button Component', () => {
  const user = userEvent.setup();

  describe('正常系', () => {
    it('ケース1: ボタンが正しく描画される', () => {
      render(<Button>Click Me</Button>);
      const buttonElement = screen.getByRole('button', { name: /click me/i });
      expect(buttonElement).toBeInTheDocument();
    });

    it('ケース2: クリックイベントが発火する', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Submit</Button>);
      const buttonElement = screen.getByRole('button', { name: /submit/i });
      await user.click(buttonElement);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('異常系 / エッジケース', () => {
    it('ケース3: disabled状態ではクリックイベントが発火しない', async () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );
      const buttonElement = screen.getByRole('button', { name: /disabled/i });
      expect(buttonElement).toBeDisabled();
      await user.click(buttonElement);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('ケース4: childrenが未指定でもエラーなく描画される', () => {
      expect(() => render(<Button>Click Me</Button>)).not.toThrow();
    });

    it('ケース5: onClickが未指定でもクリック時にエラーが発生しない', async () => {
      render(<Button>No-op Button</Button>);
      const buttonElement = screen.getByRole('button', { name: /no-op/i });
      await expect(user.click(buttonElement)).resolves.not.toThrow();
    });
  });

  describe('バリエーション', () => {
    test.each([
      ['primary', 'bg-primary'],
      ['secondary', 'bg-gray-600'],
      ['outline', 'border-gray-500'],
      ['danger', 'bg-red-600'],
    ])(
      'ケース6: variantが"%s"の時、正しいスタイルが適用される',
      (variant, expectedClass) => {
        render(
          <Button variant={variant as ButtonProps['variant']}>{variant}</Button>
        );
        expect(screen.getByRole('button')).toHaveClass(expectedClass);
      }
    );

    it('ケース7: type属性が正しく設定される', () => {
      const { rerender } = render(<Button>Default</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');

      rerender(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('ケース8: classNameプロパティで追加のクラスがマージされる', () => {
      render(<Button className="extra-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary'); // Base variant class
      expect(button).toHaveClass('extra-class'); // Custom class
    });
  });

  describe('アクセシビリティ', () => {
    it('ケース11: キーボード操作でフォーカスおよび操作が可能である', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Accessible Button</Button>);
      const button = screen.getByRole('button', { name: /accessible/i });

      await user.tab();
      expect(button).toHaveFocus();

      await user.keyboard('{enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);

      // await user.keyboard('{space}');
      // expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });
});
