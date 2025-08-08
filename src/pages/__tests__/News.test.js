import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import News from '../News';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../navigation/NavBar', () => {
  return function MockNavBar() {
    return <div data-testid="navbar">NavBar</div>;
  };
});

jest.mock('../../config/api', () => ({
  news: {
    getAll: 'http://localhost:3001/api/news',
    delete: (id) => `http://localhost:3001/api/news/${id}`
  }
}));

global.fetch = jest.fn();

const NewsWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

const mockNoticias = [
  {
    id_new: 1,
    titulo_new: 'Evento de prueba 1',
    detalle_new: 'Descripción del evento 1'
  },
  {
    id_new: 2,
    titulo_new: 'Evento de prueba 2',
    detalle_new: 'Descripción del evento 2'
  }
];

describe('News', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
  });

  test('renders news page with header', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockNoticias,
    });

    render(
      <NewsWrapper>
        <News />
      </NewsWrapper>
    );

    expect(screen.getByText('Eventos')).toBeInTheDocument();
    expect(screen.getByText('Crear Evento')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    fetch.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <NewsWrapper>
        <News />
      </NewsWrapper>
    );

    expect(screen.getByText('Cargando evento...')).toBeInTheDocument();
  });

  test('displays news list when loaded', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockNoticias,
    });

    render(
      <NewsWrapper>
        <News />
      </NewsWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Evento de prueba 1')).toBeInTheDocument();
      expect(screen.getByText('Evento de prueba 2')).toBeInTheDocument();
    });
  });

  test('shows empty state when no news', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <NewsWrapper>
        <News />
      </NewsWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('No hay eventos disponibles')).toBeInTheDocument();
      expect(screen.getByText('Crear primer evento')).toBeInTheDocument();
    });
  });

  test('shows error state on fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Error al cargar las noticias'));

    render(
      <NewsWrapper>
        <News />
      </NewsWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Error al cargar las noticias')).toBeInTheDocument();
      expect(screen.getByText('Reintentar')).toBeInTheDocument();
    });
  });

  test('navigates to create news page', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockNoticias,
    });

    const user = userEvent.setup();
    render(
      <NewsWrapper>
        <News />
      </NewsWrapper>
    );

    const createButton = screen.getByText('Crear Evento');
    await user.click(createButton);

    expect(mockNavigate).toHaveBeenCalledWith('/NewR');
  });

  test('navigates to edit news page', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockNoticias,
    });

    const user = userEvent.setup();
    render(
      <NewsWrapper>
        <News />
      </NewsWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Evento de prueba 1')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Editar');
    await user.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/EditN/1');
  });

  test('renders edit and delete buttons for each news item', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockNoticias,
    });

    render(
      <NewsWrapper>
        <News />
      </NewsWrapper>
    );

    await waitFor(() => {
      const editButtons = screen.getAllByText('Editar');
      const deleteButtons = screen.getAllByText('Eliminar');
      
      expect(editButtons).toHaveLength(2);
      expect(deleteButtons).toHaveLength(2);
    });
  });
});