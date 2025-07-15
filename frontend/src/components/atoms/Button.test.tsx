import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

describe('Button Component', () => {
  it('renders correctly with children', () => {
    render(<Button>Click Me</Button>);
    // `getByRole` is a robust way to find elements accessible to users.
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Submit</Button>);
    const buttonElement = screen.getByText(/submit/i);
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and does not call onClick when disabled prop is true', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );
    const buttonElement = screen.getByRole('button', {
      name: /disabled button/i,
    });
    expect(buttonElement).toBeDisabled();
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Using test.each to test multiple variants with less boilerplate
  test.each([
    ['primary', 'bg-primary'],
    ['secondary', 'bg-gray-600'],
    ['outline', 'border-gray-500'],
    ['danger', 'bg-red-600'],
  ])(
    'applies the correct styles for the "%s" variant',
    (variant, expectedClass) => {
      render(
        <Button
          variant={variant as 'primary' | 'secondary' | 'outline' | 'danger'}
        >
          {variant}
        </Button>
      );
      expect(screen.getByRole('button')).toHaveClass(expectedClass);
    }
  );
});
