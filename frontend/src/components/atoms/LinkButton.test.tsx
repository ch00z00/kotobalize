import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LinkButton from './LinkButton';

describe('LinkButton Component', () => {
  const user = userEvent.setup();

  it('ケース1: リンクとして正しく描画される', () => {
    render(<LinkButton href="/about">About Page</LinkButton>);
    const linkElement = screen.getByRole('link', { name: /about page/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/about');
  });

  test.each([
    ['primary', 'bg-primary'],
    ['secondary', 'bg-gray-600'],
    ['outline', 'border-gray-500'],
  ])(
    'ケース2: variantが"%s"の時、正しいスタイルが適用される',
    (variant, expectedClass) => {
      render(
        <LinkButton
          href="#"
          variant={variant as 'primary' | 'secondary' | 'outline'}
        >
          {variant} Link
        </LinkButton>
      );
      expect(screen.getByRole('link')).toHaveClass(expectedClass);
    }
  );

  it('ケース3: classNameプロパティで追加のクラスがマージされる', () => {
    render(
      <LinkButton href="#" className="extra-class">
        Custom Link
      </LinkButton>
    );
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveClass('bg-primary');
    expect(linkElement).toHaveClass('extra-class');
  });

  it('ケース5: キーボード操作でフォーカスが当たる', async () => {
    render(<LinkButton href="/about">Focus me</LinkButton>);
    const linkElement = screen.getByRole('link', { name: /focus me/i });

    await user.tab();

    expect(linkElement).toHaveFocus();
  });
});
