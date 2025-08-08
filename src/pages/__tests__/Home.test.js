import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

// Mock de componentes
jest.mock('../navigation/NavBar', () => {
  return function MockNavBar() {
    return <div data-testid="navbar">NavBar</div>;
  };
});

jest.mock('../components/ParticlesBackground', () => {
  return function MockParticlesBackground() {
    return <div data-testid="particles-background">Particles</div>;
  };
});

jest.mock('../components/scrollAnimations', () => ({
  initScrollAnimations: jest.fn(),
}));

const HomeWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Home', () => {
  test('renders main sections', () => {
    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    expect(screen.getByText('Soluciones Ambientales Integrales')).toBeInTheDocument();
    expect(screen.getByText('Precisión • Confiabilidad • Innovación')).toBeInTheDocument();
    expect(screen.getByText('Sobre Nosotros')).toBeInTheDocument();
    expect(screen.getByText('¿Por qué elegirnos?')).toBeInTheDocument();
    expect(screen.getByText('Nuestros Servicios')).toBeInTheDocument();
  });

  test('renders feature cards', () => {
    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    expect(screen.getByText('Experiencia y Confiabilidad')).toBeInTheDocument();
    expect(screen.getByText('Tecnología Avanzada')).toBeInTheDocument();
    expect(screen.getByText('Atención Personalizada')).toBeInTheDocument();
    expect(screen.getByText('Cumplimiento Normativo')).toBeInTheDocument();
  });

  test('renders service cards', () => {
    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    expect(screen.getByText('Muestreo y Análisis de Agua')).toBeInTheDocument();
    expect(screen.getByText('Recipientes Sujetos a Presión')).toBeInTheDocument();
    expect(screen.getByText('Análisis de Ambiente Laboral')).toBeInTheDocument();
  });

  test('renders privacy section', () => {
    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    expect(screen.getByText('Aviso de Privacidad')).toBeInTheDocument();
    expect(screen.getByText('Datos personales que recabamos y protegemos:')).toBeInTheDocument();
    expect(screen.getByText('Finalidades del uso de sus datos:')).toBeInTheDocument();
  });

  test('renders footer with copyright', () => {
    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© Ambiolab – Derechos Reservados ${currentYear}`)).toBeInTheDocument();
  });
});