import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  test('renders with default message', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  test('renders with custom message', () => {
    const customMessage = 'Procesando datos...';
    render(<LoadingSpinner message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  test('renders spinner element', () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });

  test('has correct CSS classes', () => {
    render(<LoadingSpinner />);
    const container = document.querySelector('.loading-spinner-container');
    const message = document.querySelector('.loading-message');
    
    expect(container).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  });
});