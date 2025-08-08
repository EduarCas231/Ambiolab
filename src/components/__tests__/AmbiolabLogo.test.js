import React from 'react';
import { render, screen } from '@testing-library/react';
import AmbiolabLogo from '../AmbiolabLogo';

describe('AmbiolabLogo', () => {
  test('renders AMBIOLAB text', () => {
    render(<AmbiolabLogo />);
    expect(screen.getByText('AMBIOLAB')).toBeInTheDocument();
  });

  test('renders logo circles', () => {
    render(<AmbiolabLogo />);
    const circles = document.querySelectorAll('.circle');
    expect(circles).toHaveLength(3);
  });

  test('has correct circle classes', () => {
    render(<AmbiolabLogo />);
    expect(document.querySelector('.circle-wind')).toBeInTheDocument();
    expect(document.querySelector('.circle-helmet')).toBeInTheDocument();
    expect(document.querySelector('.circle-chimney')).toBeInTheDocument();
  });

  test('renders decorative line', () => {
    render(<AmbiolabLogo />);
    expect(document.querySelector('.decorative-line')).toBeInTheDocument();
  });

  test('has main container structure', () => {
    render(<AmbiolabLogo />);
    expect(document.querySelector('.ambiolab-logo')).toBeInTheDocument();
    expect(document.querySelector('.circles-container')).toBeInTheDocument();
    expect(document.querySelector('.logo-text')).toBeInTheDocument();
  });
});