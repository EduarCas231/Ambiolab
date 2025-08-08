import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Pedidos from '../pedidos/Pedidos';

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

jest.mock('../../components/NormaIcon', () => {
  return function MockNormaIcon({ norma }) {
    return <span data-testid="norma-icon">{norma}</span>;
  };
});

jest.mock('../../config/api', () => ({
  pedidos: {
    getAll: 'http://localhost:3001/api/pedidos'
  }
}));

global.fetch = jest.fn();

const PedidosWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

const mockPedidos = [
  {
    id_pedidos: 1,
    nombre: 'Pedido Test 1',
    norma: 'NOM-001',
    estatus: 'en proceso',
    fecha_inicio: '2024-01-01',
    fecha_final: '2024-12-31',
    comentario: 'Comentario test',
    precio: 1000,
    modificado_por_nombre: 'Juan',
    modificado_por_app: 'Pérez'
  },
  {
    id_pedidos: 2,
    nombre: 'Pedido Test 2',
    norma: 'NOM-002',
    estatus: 'completado',
    fecha_inicio: '2024-01-01',
    fecha_final: '2024-06-30',
    comentario: 'Otro comentario',
    precio: 2000,
    modificado_por_nombre: 'María',
    modificado_por_app: 'García'
  }
];

describe('Pedidos', () => {
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
      <PedidosWrapper>
        <Pedidos />
      </PedidosWrapper>
    );

    expect(screen.getByText('Cargando pedidos...')).toBeInTheDocument();
  });

  test('renders pedidos list when loaded', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPedidos,
    });

    render(
      <PedidosWrapper>
        <Pedidos />
      </PedidosWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Lista de Pedidos')).toBeInTheDocument();
      expect(screen.getByText('Pedido Test 1')).toBeInTheDocument();
      expect(screen.getByText('Pedido Test 2')).toBeInTheDocument();
    });
  });

  test('navigates to new registro page', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPedidos,
    });

    const user = userEvent.setup();
    render(
      <PedidosWrapper>
        <Pedidos />
      </PedidosWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Lista de Pedidos')).toBeInTheDocument();
    });

    const newButton = screen.getByText('Nuevo Registro');
    await user.click(newButton);

    expect(mockNavigate).toHaveBeenCalledWith('/registros');
  });

  test('navigates to edit page when clicking actualizar', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPedidos,
    });

    const user = userEvent.setup();
    render(
      <PedidosWrapper>
        <Pedidos />
      </PedidosWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Pedido Test 1')).toBeInTheDocument();
    });

    const updateButtons = screen.getAllByText('Actualizar');
    await user.click(updateButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/edits/1');
  });

  test('displays status badges correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPedidos,
    });

    render(
      <PedidosWrapper>
        <Pedidos />
      </PedidosWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('En Proceso')).toBeInTheDocument();
      expect(screen.getByText('Completado')).toBeInTheDocument();
    });
  });

  test('formats prices correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPedidos,
    });

    render(
      <PedidosWrapper>
        <Pedidos />
      </PedidosWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('$1,000.00')).toBeInTheDocument();
      expect(screen.getByText('$2,000.00')).toBeInTheDocument();
    });
  });

  test('shows error state on fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Error al obtener pedidos'));

    render(
      <PedidosWrapper>
        <Pedidos />
      </PedidosWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Error al obtener pedidos')).toBeInTheDocument();
    });
  });

  test('shows empty state when no pedidos', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <PedidosWrapper>
        <Pedidos />
      </PedidosWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('No hay pedidos disponibles.')).toBeInTheDocument();
    });
  });

  test('disables update button for completed pedidos', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPedidos,
    });

    render(
      <PedidosWrapper>
        <Pedidos />
      </PedidosWrapper>
    );

    await waitFor(() => {
      const updateButtons = screen.getAllByText('Actualizar');
      expect(updateButtons[1]).toBeDisabled(); // Second button should be disabled (completed status)
    });
  });
});