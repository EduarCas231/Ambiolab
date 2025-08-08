import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Users from '../users/Users';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../navigation/NavBar', () => {
  return function MockNavBar() {
    return <div data-testid="navbar">NavBar</div>;
  };
});

jest.mock('../../components/LoadingSpinner', () => {
  return function MockLoadingSpinner({ message }) {
    return <div data-testid="loading-spinner">{message}</div>;
  };
});

jest.mock('../../config/api', () => ({
  users: {
    getAll: 'http://localhost:3001/api/users'
  }
}));

global.fetch = jest.fn();
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => 'fake-token'),
  },
});

const UsersWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

const mockUsers = [
  {
    id_user: 1,
    nombre: 'Juan',
    app: 'Pérez',
    apm: 'López',
    tipo: 1
  },
  {
    id_user: 2,
    nombre: 'María',
    app: 'García',
    apm: 'Martínez',
    tipo: 2
  }
];

describe('Users', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
  });

  test('shows loading state initially', () => {
    fetch.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <UsersWrapper>
        <Users />
      </UsersWrapper>
    );

    expect(screen.getByText('Cargando usuarios...')).toBeInTheDocument();
  });

  test('renders users list when loaded', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(
      <UsersWrapper>
        <Users />
      </UsersWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument();
      expect(screen.getByText('Juan Pérez López')).toBeInTheDocument();
      expect(screen.getByText('María García Martínez')).toBeInTheDocument();
    });
  });

  test('shows user count', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(
      <UsersWrapper>
        <Users />
      </UsersWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('2 usuarios')).toBeInTheDocument();
    });
  });

  test('displays user types correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(
      <UsersWrapper>
        <Users />
      </UsersWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Administrador')).toBeInTheDocument();
      expect(screen.getByText('Operador')).toBeInTheDocument();
    });
  });

  test('toggles between grid and list view', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    const user = userEvent.setup();
    render(
      <UsersWrapper>
        <Users />
      </UsersWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez López')).toBeInTheDocument();
    });

    const listViewButton = screen.getAllByRole('button')[1]; // Second toggle button
    await user.click(listViewButton);

    // Check if view changed (this would require checking CSS classes or other indicators)
    expect(listViewButton).toHaveClass('active');
  });

  test('navigates to edit user page', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    const user = userEvent.setup();
    render(
      <UsersWrapper>
        <Users />
      </UsersWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez López')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByTitle('Editar usuario');
    await user.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/users/edit/1');
  });

  test('shows error state on fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Error al obtener usuarios'));

    render(
      <UsersWrapper>
        <Users />
      </UsersWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Error: Error al obtener usuarios')).toBeInTheDocument();
    });
  });

  test('shows empty state when no users', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <UsersWrapper>
        <Users />
      </UsersWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('No hay usuarios registrados')).toBeInTheDocument();
    });
  });
});