import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Visitas from '../visitas/Visitas';

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

jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: false })),
}));

jest.mock('../../config/api', () => ({
  visitas: {
    getAll: 'http://localhost:3001/api/visitas',
    delete: (id) => `http://localhost:3001/api/visitas/${id}`
  },
  notificaciones: {
    getAll: 'http://localhost:3001/api/notificaciones',
    markAllAsRead: 'http://localhost:3001/api/notificaciones/mark-read'
  }
}));

global.fetch = jest.fn();

const VisitasWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

const mockVisitas = [
  {
    id: 1,
    nombre: 'Juan',
    apellidoPaterno: 'Pérez',
    apellidoMaterno: 'López',
    lugar: 'Oficina A',
    hora: '09:00:00',
    dia: '2024-01-15',
    departamento: 'IT',
    escaneado: false
  },
  {
    id: 2,
    nombre: 'María',
    apellidoPaterno: 'García',
    apellidoMaterno: 'Martínez',
    lugar: 'Sala de juntas',
    hora: '14:30:00',
    dia: '2024-01-15',
    departamento: 'RRHH',
    escaneado: true
  }
];

const mockNotificaciones = [
  {
    id: 1,
    mensaje: 'Nueva visita registrada',
    leida: false,
    visita_id: 1,
    created_at: '2024-01-15T09:00:00Z'
  }
];

describe('Visitas', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('shows loading state initially', () => {
    fetch.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <VisitasWrapper>
        <Visitas />
      </VisitasWrapper>
    );

    expect(screen.getByText('Cargando visitas...')).toBeInTheDocument();
  });

  test('renders visitas list when loaded', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockVisitas }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockNotificaciones }),
      });

    render(
      <VisitasWrapper>
        <Visitas />
      </VisitasWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Registro de Visitas')).toBeInTheDocument();
      expect(screen.getByText('Juan Pérez López')).toBeInTheDocument();
      expect(screen.getByText('María García Martínez')).toBeInTheDocument();
    });
  });

  test('shows active and history tabs with counts', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockVisitas }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockNotificaciones }),
      });

    render(
      <VisitasWrapper>
        <Visitas />
      </VisitasWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Activos (1)')).toBeInTheDocument();
      expect(screen.getByText('Historial (1)')).toBeInTheDocument();
    });
  });

  test('filters visitas by name', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockVisitas }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockNotificaciones }),
      });

    const user = userEvent.setup();
    render(
      <VisitasWrapper>
        <Visitas />
      </VisitasWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez López')).toBeInTheDocument();
    });

    const nameFilter = screen.getByPlaceholderText('Nombre del visitante');
    await user.type(nameFilter, 'Juan');

    expect(screen.getByText('Juan Pérez López')).toBeInTheDocument();
  });

  test('navigates to new visit registration', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockVisitas }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockNotificaciones }),
      });

    const user = userEvent.setup();
    render(
      <VisitasWrapper>
        <Visitas />
      </VisitasWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Nueva Visita')).toBeInTheDocument();
    });

    const newVisitButton = screen.getByText('Nueva Visita');
    await user.click(newVisitButton);

    expect(mockNavigate).toHaveBeenCalledWith('/registrosV');
  });

  test('navigates to edit visit', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockVisitas }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockNotificaciones }),
      });

    const user = userEvent.setup();
    render(
      <VisitasWrapper>
        <Visitas />
      </VisitasWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez López')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByTitle('Editar');
    await user.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/editar/1');
  });

  test('navigates to visit details', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockVisitas }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockNotificaciones }),
      });

    const user = userEvent.setup();
    render(
      <VisitasWrapper>
        <Visitas />
      </VisitasWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez López')).toBeInTheDocument();
    });

    const detailButtons = screen.getAllByTitle('Detalles');
    await user.click(detailButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/detalles/1');
  });

  test('shows visit status correctly', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockVisitas }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockNotificaciones }),
      });

    render(
      <VisitasWrapper>
        <Visitas />
      </VisitasWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
      expect(screen.getByText('Ingresó')).toBeInTheDocument();
    });
  });

  test('disables edit and delete buttons for scanned visits', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockVisitas }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockNotificaciones }),
      });

    render(
      <VisitasWrapper>
        <Visitas />
      </VisitasWrapper>
    );

    await waitFor(() => {
      const editButtons = screen.getAllByTitle(/Editar|No se puede editar/);
      const deleteButtons = screen.getAllByTitle(/Eliminar|No se puede eliminar/);
      
      // Check that some buttons are disabled (for scanned visits)
      expect(editButtons.some(btn => btn.disabled)).toBe(true);
      expect(deleteButtons.some(btn => btn.disabled)).toBe(true);
    });
  });

  test('switches between active and history tabs', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockVisitas }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockNotificaciones }),
      });

    const user = userEvent.setup();
    render(
      <VisitasWrapper>
        <Visitas />
      </VisitasWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Activos (1)')).toBeInTheDocument();
    });

    const historyTab = screen.getByText('Historial (1)');
    await user.click(historyTab);

    expect(historyTab).toHaveClass('active');
  });
});