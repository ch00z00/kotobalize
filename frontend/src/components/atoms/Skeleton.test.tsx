import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Skeleton from './Skeleton';

describe('Skeleton Component', () => {
  it('ケース1: スケルトン要素が正しく描画される', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeletonElement = screen.getByTestId('skeleton');
    expect(skeletonElement).toBeInTheDocument();
    expect(skeletonElement).toHaveClass(
      'animate-pulse',
      'rounded-md',
      'bg-gray-200'
    );
  });

  it('ケース2: `className`プロパティで形状やサイズが変更できる', () => {
    render(
      <Skeleton className="h-24 w-24 rounded-full" data-testid="skeleton" />
    );
    const skeletonElement = screen.getByTestId('skeleton');
    expect(skeletonElement).toHaveClass('h-24', 'w-24', 'rounded-full');
  });
});
