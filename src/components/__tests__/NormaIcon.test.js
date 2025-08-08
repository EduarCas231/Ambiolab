import React from 'react';
import { render } from '@testing-library/react';
import NormaIcon from '../NormaIcon';

describe('NormaIcon', () => {
  test('renders without crashing', () => {
    const { container } = render(<NormaIcon />);
    expect(container).toBeInTheDocument();
  });

  test('has correct CSS class', () => {
    const { container } = render(<NormaIcon />);
    const icon = container.querySelector('.norma-icon');
    expect(icon).toBeInTheDocument();
  });
});