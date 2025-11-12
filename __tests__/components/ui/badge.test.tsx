import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge Component', () => {
  it('should render with default variant', () => {
    render(<Badge>Test Badge</Badge>);
    const badge = screen.getByText('Test Badge');
    expect(badge).toBeInTheDocument();
  });

  it('should render with different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText('Default')).toBeInTheDocument();

    rerender(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary')).toBeInTheDocument();

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText('Destructive')).toBeInTheDocument();

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-class');
  });

  it('should render children correctly', () => {
    render(
      <Badge>
        <span>Complex</span> Content
      </Badge>
    );
    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText(/Content/)).toBeInTheDocument();
  });
});
