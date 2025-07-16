import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Icon from './Icon';

describe('Icon Component', () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    // `console.warn`がテストログを汚さないようにモック化します。
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('ケース1: 指定されたアイコンが正しく描画される', () => {
    render(<Icon name="MessageSquare" data-testid="test-icon" />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('ケース3: `size`, `color`, `className`などのプロパティが適用される', () => {
    render(<Icon name="Save" size={48} color="blue" className="extra-class" />);
    // lucide-reactはデフォルトでrole="img"とaria-hidden="true"を設定します
    const iconElement = screen.getByRole('img', { hidden: true });
    expect(iconElement).toHaveClass('lucide-save', 'extra-class');
    expect(iconElement).toHaveAttribute('width', '48');
    expect(iconElement).toHaveAttribute('stroke', 'blue');
  });

  it('ケース2: 存在しないアイコン名が渡された場合', () => {
    const { container } = render(<Icon name={'InvalidIconName' as any} />);
    expect(container.firstChild).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Icon with name "InvalidIconName" not found.'
    );
  });
});
