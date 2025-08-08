import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock de componentes que requieren navegación
jest.mock('../navigation/AppNavigator', () => {
  return function MockAppNavigator() {
    return <div data-testid="app-navigator">App Navigator</div>;
  };
});

const AppWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('App', () => {
  test('renders without crashing', () => {
    render(
      <AppWrapper>
        <App />
      </AppWrapper>
    );
    expect(screen.getByTestId('app-navigator')).toBeInTheDocument();
  });

  test('has correct structure', () => {
    const { container } = render(
      <AppWrapper>
        <App />
      </AppWrapper>
    );
    expect(container.firstChild).toHaveClass('App');
  });
});