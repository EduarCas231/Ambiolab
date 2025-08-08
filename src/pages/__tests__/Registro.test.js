import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Registro from '../Registro';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../config/api', () => ({
  auth: {
    register: 'http://localhost:3001/api/auth/register'
  }
}));

global.fetch = jest.fn();

const RegistroWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Registro', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
  });

  test('renders registration form', () => {
    render(
      <RegistroWrapper>
        <Registro />
      </RegistroWrapper>
    );

    expect(screen.getByText('Crear Cuenta')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre(s)*')).toBeInTheDocument();
    expect(screen.getByLabelText('Apellido Paterno*')).toBeInTheDocument();
    expect(screen.getByLabelText('Apellido Materno*')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico*')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña*')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Contraseña*')).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    const user = userEvent.setup();
    render(
      <RegistroWrapper>
        <Registro />
      </RegistroWrapper>
    );

    const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('Este campo es requerido')).toHaveLength(6);
    });
  });

  test('validates email format', async () => {
    const user = userEvent.setup();
    render(
      <RegistroWrapper>
        <Registro />
      </RegistroWrapper>
    );

    const emailInput = screen.getByLabelText('Correo electrónico*');
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    expect(screen.getByText('Correo electrónico inválido')).toBeInTheDocument();
  });

  test('validates password confirmation', async () => {
    const user = userEvent.setup();
    render(
      <RegistroWrapper>
        <Registro />
      </RegistroWrapper>
    );

    const passwordInput = screen.getByLabelText('Contraseña*');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Contraseña*');

    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'different');
    await user.tab();

    expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
  });

  test('shows password strength indicator', async () => {
    const user = userEvent.setup();
    render(
      <RegistroWrapper>
        <Registro />
      </RegistroWrapper>
    );

    const passwordInput = screen.getByLabelText('Contraseña*');
    await user.type(passwordInput, 'Password123!');

    expect(screen.getByText(/Seguridad:/)).toBeInTheDocument();
  });

  test('successful registration redirects to login', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Usuario registrado exitosamente' }),
    });

    render(
      <RegistroWrapper>
        <Registro />
      </RegistroWrapper>
    );

    await user.type(screen.getByLabelText('Nombre(s)*'), 'Juan');
    await user.type(screen.getByLabelText('Apellido Paterno*'), 'Pérez');
    await user.type(screen.getByLabelText('Apellido Materno*'), 'López');
    await user.type(screen.getByLabelText('Correo electrónico*'), 'test@test.com');
    await user.type(screen.getByLabelText('Contraseña*'), 'Password123!');
    await user.type(screen.getByLabelText('Confirmar Contraseña*'), 'Password123!');

    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(screen.getByText('¡Registro exitoso! Redirigiendo al login...')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }, { timeout: 3000 });
  });

  test('shows error on failed registration', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'El correo ya está registrado' }),
    });

    render(
      <RegistroWrapper>
        <Registro />
      </RegistroWrapper>
    );

    await user.type(screen.getByLabelText('Nombre(s)*'), 'Juan');
    await user.type(screen.getByLabelText('Apellido Paterno*'), 'Pérez');
    await user.type(screen.getByLabelText('Apellido Materno*'), 'López');
    await user.type(screen.getByLabelText('Correo electrónico*'), 'test@test.com');
    await user.type(screen.getByLabelText('Contraseña*'), 'Password123!');
    await user.type(screen.getByLabelText('Confirmar Contraseña*'), 'Password123!');

    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(screen.getByText('El correo ya está registrado')).toBeInTheDocument();
    });
  });
});