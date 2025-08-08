import React from 'react';
import { render, screen } from '@testing-library/react';
import LabsaLogo from '../LabsaLogo';

describe('LabsaLogo', () => {
  test('renders LABSA text', () => {
    render(<LabsaLogo />);
    expect(screen.getByText('LABSA')).toBeInTheDocument();
  });

  test('renders logo circles', () => {
    render(<LabsaLogo />);
    const circles = document.querySelectorAll('.labsa-circle');
    expect(circles).toHaveLength(4);
  });

  test('has correct structure', () => {
    render(<LabsaLogo />);
    expect(document.querySelector('.labsa-logo-container')).toBeInTheDocument();
    expect(document.querySelector('.labsa-logo-symbol')).toBeInTheDocument();
    expect(document.querySelector('.labsa-text')).toBeInTheDocument();
  });

  test('renders shadow element', () => {
    render(<LabsaLogo />);
    expect(document.querySelector('.labsa-shadow')).toBeInTheDocument();
  });

  test('has numbered circle classes', () => {
    render(<LabsaLogo />);
    expect(document.querySelector('.circle-1')).toBeInTheDocument();
    expect(document.querySelector('.circle-2')).toBeInTheDocument();
    expect(document.querySelector('.circle-3')).toBeInTheDocument();
    expect(document.querySelector('.circle-4')).toBeInTheDocument();
  });
});