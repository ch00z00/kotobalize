import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tag from './Tag';

describe('Tag Component', () => {
  it('ケース1: タグが正しく描画される', () => {
    render(<Tag>バックエンド</Tag>);
    const tagElement = screen.getByText('バックエンド');

    expect(tagElement).toBeInTheDocument();
    expect(tagElement).toHaveClass('bg-primary/10', 'text-primary');
  });

  it('ケース2: classNameプロパティで追加のクラスがマージされる', () => {
    render(<Tag className="extra-class">Test</Tag>);
    const tagElement = screen.getByText('Test');
    expect(tagElement).toHaveClass('bg-primary/10');
    expect(tagElement).toHaveClass('extra-class');
  });
});
