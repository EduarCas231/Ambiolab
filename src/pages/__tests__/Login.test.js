import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Mock del módulo de navegación
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock de la API
jest.mock('../../config/api', () => ({
  auth: {
    login: 'http://localhost:3001/api/auth/login'
  }
}));

// Mock de fetch
global.fetch = jest.fn();

const LoginWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Login', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
    localStorage.clear();
  });

  test('renders login form elements', () => {
    render(
      <LoginWrapper>
        <Login />
      </LoginWrapper>
    );

    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test('shows error when fields are empty', async () => {
    const user = userEvent.setup();
    render(
      <LoginWrapper>
        <Login />
      </LoginWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);

    expect(screen.getByText('Correo y contraseña son requeridos')).toBeInTheDocument();
  });

  test('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(
      <LoginWrapper>
        <Login />
      </LoginWrapper>
    );

    const passwordInput = screen.getByLabelText('Contraseña');
    const toggleButton = screen.getByLabelText('toggle password visibility');

    expect(passwordInput).toHaveAttribute('type', 'password');
    
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('successful login redirects to home', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      token: 'fake-token',
      user: { nombre: 'Test User', tipo: 1 }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(
      <LoginWrapper>
        <Login />
      </LoginWrapper>
    );

    await user.type(screen.getByLabelText('Correo electrónico'), 'test@test.com');
    await user.type(screen.getByLabelText('Contraseña'), 'password123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(localStorage.getItem('tipo')).toBe('1');
      expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
    });
  });

  test('shows error on failed login', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Credenciales inválidas' }),
    });

    render(
      <LoginWrapper>
        <Login />
      </LoginWrapper>
    );

    await user.type(screen.getByLabelText('Correo electrónico'), 'test@test.com');
    await user.type(screen.getByLabelText('Contraseña'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });
  });

  test('shows loading state during login', async () => {
    const user = userEvent.setup();
    fetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <LoginWrapper>
        <Login />
      </LoginWrapper>
    );

    await user.type(screen.getByLabelText('Correo electrónico'), 'test@test.com');
    await user.type(screen.getByLabelText('Contraseña'), 'password123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(screen.getByText('Procesando...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /procesando/i })).toBeDisabled();
  });

  test('renders forgot password and register links', () => {
    render(
      <LoginWrapper>
        <Login />
      </LoginWrapper>
    );

    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
    expect(screen.getByText('Regístrate')).toBeInTheDocument();
  });
});