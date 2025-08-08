import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Contra from '../Contra';

jest.mock('../navigation/NavBar', () => {
  return function MockNavBar() {
    return <div data-testid="navbar">NavBar</div>;
  };
});

const ContraWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Contra', () => {
  test('renders password reset page', () => {
    render(
      <ContraWrapper>
        <Contra />
      </ContraWrapper>
    );

    expect(screen.getByText('Restablecer contraseña')).toBeInTheDocument();
  });

  test('displays support information', () => {
    render(
      <ContraWrapper>
        <Contra />
      </ContraWrapper>
    );

    expect(screen.getByText(/Actualmente, el restablecimiento de contraseñas debe realizarse/)).toBeInTheDocument();
    expect(screen.getByText(/Contacta al equipo de Soporte TIC/)).toBeInTheDocument();
  });

  test('has correct structure and styling elements', () => {
    render(
      <ContraWrapper>
        <Contra />
      </ContraWrapper>
    );

    expect(screen.getByText('🔒')).toBeInTheDocument();
    expect(screen.getByText('🛠️')).toBeInTheDocument();
  });
});