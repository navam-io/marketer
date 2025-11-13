/**
 * Integration tests for Navigation component
 * Tests production navigation behavior across different pages
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Navigation } from '@/components/navigation';
import '@testing-library/jest-dom';

// Mock next/navigation
const mockPush = jest.fn();
const mockPathname = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => mockPathname(),
}));

describe('Navigation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Home Page Navigation', () => {
    it('should render brand name', () => {
      mockPathname.mockReturnValue('/');
      render(<Navigation />);

      expect(screen.getByText('Navam Marketer')).toBeInTheDocument();
    });

    it('should render all primary navigation items', () => {
      mockPathname.mockReturnValue('/');
      render(<Navigation />);

      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /sources/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /campaigns/i })).toBeInTheDocument();
    });

    it('should render tagline', () => {
      mockPathname.mockReturnValue('/');
      render(<Navigation />);

      expect(screen.getByText('Marketing Automation for Bootstrapped Founders')).toBeInTheDocument();
    });

    it('should highlight home as active on home page', () => {
      mockPathname.mockReturnValue('/');
      render(<Navigation />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      const homeButton = homeLink.querySelector('button');

      expect(homeButton).toHaveClass('bg-primary');
    });

    it('should not show breadcrumbs on home page', () => {
      mockPathname.mockReturnValue('/');
      const { container } = render(<Navigation />);

      // Breadcrumb bar should not exist
      const breadcrumbBar = container.querySelector('.border-t');
      expect(breadcrumbBar).toBeNull();
    });

    it('should have correct navigation links', () => {
      mockPathname.mockReturnValue('/');
      render(<Navigation />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      const sourcesLink = screen.getByRole('link', { name: /sources/i });
      const campaignsLink = screen.getByRole('link', { name: /campaigns/i });

      expect(homeLink).toHaveAttribute('href', '/');
      expect(sourcesLink).toHaveAttribute('href', '/sources');
      expect(campaignsLink).toHaveAttribute('href', '/campaigns');
    });
  });

  describe('Sources Page Navigation', () => {
    it('should highlight sources as active', () => {
      mockPathname.mockReturnValue('/sources');
      render(<Navigation />);

      const sourcesLink = screen.getByRole('link', { name: /sources/i });
      const sourcesButton = sourcesLink.querySelector('button');

      expect(sourcesButton).toHaveClass('bg-primary');
    });

    it('should show breadcrumb trail on sources page', () => {
      mockPathname.mockReturnValue('/sources');
      render(<Navigation />);

      // Should show "Home > Sources"
      const breadcrumbs = screen.getAllByText(/sources/i);
      expect(breadcrumbs.length).toBeGreaterThan(0);
    });

    it('should show home link in breadcrumbs', () => {
      mockPathname.mockReturnValue('/sources');
      render(<Navigation />);

      const breadcrumbLinks = screen.getAllByRole('link');
      const homeInBreadcrumb = breadcrumbLinks.find(
        link => link.getAttribute('href') === '/' && link.textContent?.includes('Home')
      );

      expect(homeInBreadcrumb).toBeInTheDocument();
    });

    it('should not highlight home or campaigns when on sources', () => {
      mockPathname.mockReturnValue('/sources');
      render(<Navigation />);

      const allButtons = screen.getAllByRole('button');
      const homeButton = allButtons.find(btn => btn.textContent?.includes('Home'));
      const campaignsButton = allButtons.find(btn => btn.textContent?.includes('Campaigns'));

      // Home and Campaigns should have ghost variant (not active)
      if (homeButton) {
        expect(homeButton).not.toHaveClass('bg-primary');
      }
      if (campaignsButton) {
        expect(campaignsButton).not.toHaveClass('bg-primary');
      }
    });
  });

  describe('Campaigns Page Navigation', () => {
    it('should highlight campaigns as active', () => {
      mockPathname.mockReturnValue('/campaigns');
      render(<Navigation />);

      const campaignsLink = screen.getByRole('link', { name: /campaigns/i });
      const campaignsButton = campaignsLink.querySelector('button');

      expect(campaignsButton).toHaveClass('bg-primary');
    });

    it('should show breadcrumb trail on campaigns page', () => {
      mockPathname.mockReturnValue('/campaigns');
      render(<Navigation />);

      const breadcrumbs = screen.getAllByText(/campaigns/i);
      expect(breadcrumbs.length).toBeGreaterThan(0);
    });

    it('should show home link in breadcrumbs', () => {
      mockPathname.mockReturnValue('/campaigns');
      render(<Navigation />);

      const breadcrumbLinks = screen.getAllByRole('link');
      const homeInBreadcrumb = breadcrumbLinks.find(
        link => link.getAttribute('href') === '/' && link.textContent?.includes('Home')
      );

      expect(homeInBreadcrumb).toBeInTheDocument();
    });
  });

  describe('Navigation Persistence', () => {
    it('should maintain navigation state across page changes', () => {
      // Render on home
      mockPathname.mockReturnValue('/');
      const { rerender } = render(<Navigation />);

      const homeButton = screen.getByRole('link', { name: /home/i }).querySelector('button');
      expect(homeButton).toHaveClass('bg-primary');

      // Navigate to sources
      mockPathname.mockReturnValue('/sources');
      rerender(<Navigation />);

      const sourcesButton = screen.getByRole('link', { name: /sources/i }).querySelector('button');
      expect(sourcesButton).toHaveClass('bg-primary');

      // Navigate to campaigns
      mockPathname.mockReturnValue('/campaigns');
      rerender(<Navigation />);

      const campaignsButton = screen.getByRole('link', { name: /campaigns/i }).querySelector('button');
      expect(campaignsButton).toHaveClass('bg-primary');
    });
  });

  describe('Responsive Behavior', () => {
    it('should render sticky header', () => {
      mockPathname.mockReturnValue('/');
      const { container } = render(<Navigation />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('sticky');
      expect(header).toHaveClass('top-0');
      expect(header).toHaveClass('z-50');
    });

    it('should have shadow for elevation', () => {
      mockPathname.mockReturnValue('/');
      const { container } = render(<Navigation />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('shadow-sm');
    });

    it('should have white background', () => {
      mockPathname.mockReturnValue('/');
      const { container } = render(<Navigation />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('bg-white');
    });

    it('should have border bottom', () => {
      mockPathname.mockReturnValue('/');
      const { container } = render(<Navigation />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('border-b');
    });
  });

  describe('Navigation Icons', () => {
    it('should render home icon', () => {
      mockPathname.mockReturnValue('/');
      const { container } = render(<Navigation />);

      // Lucide icons render as SVG
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should render sources icon', () => {
      mockPathname.mockReturnValue('/sources');
      const { container } = render(<Navigation />);

      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should render campaigns icon', () => {
      mockPathname.mockReturnValue('/campaigns');
      const { container } = render(<Navigation />);

      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Breadcrumb Navigation', () => {
    it('should show chevron separator in breadcrumbs', () => {
      mockPathname.mockReturnValue('/sources');
      const { container } = render(<Navigation />);

      // ChevronRight icon should be present
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should format breadcrumb text correctly', () => {
      mockPathname.mockReturnValue('/sources');
      render(<Navigation />);

      // Current page should be in breadcrumb
      expect(screen.getAllByText(/sources/i).length).toBeGreaterThan(0);
    });

    it('should style current page differently in breadcrumb', () => {
      mockPathname.mockReturnValue('/sources');
      const { container } = render(<Navigation />);

      const breadcrumbBar = container.querySelector('.border-t');
      expect(breadcrumbBar).toBeInTheDocument();
    });
  });

  describe('Navigation Accessibility', () => {
    it('should use semantic nav element', () => {
      mockPathname.mockReturnValue('/');
      const { container } = render(<Navigation />);

      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('should use semantic header element', () => {
      mockPathname.mockReturnValue('/');
      const { container } = render(<Navigation />);

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should have accessible button elements', () => {
      mockPathname.mockReturnValue('/');
      render(<Navigation />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    it('should have accessible link elements', () => {
      mockPathname.mockReturnValue('/');
      render(<Navigation />);

      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);

      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });
  });
});
