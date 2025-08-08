import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NormaAutocomplete from '../NormaAutocomplete';

describe('NormaAutocomplete', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders input and explore button', () => {
    render(<NormaAutocomplete />);
    expect(screen.getByPlaceholderText('Escriba o seleccione una norma...')).toBeInTheDocument();
    expect(screen.getByText('Explorar')).toBeInTheDocument();
  });

  test('displays initial value', () => {
    const initialValue = 'Test norma';
    render(<NormaAutocomplete value={initialValue} />);
    expect(screen.getByDisplayValue(initialValue)).toBeInTheDocument();
  });

  test('calls onChange when typing', async () => {
    const user = userEvent.setup();
    render(<NormaAutocomplete onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText('Escriba o seleccione una norma...');
    await user.type(input, 'test');
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  test('opens modal when explore button is clicked', async () => {
    const user = userEvent.setup();
    render(<NormaAutocomplete />);
    
    const exploreButton = screen.getByText('Explorar');
    await user.click(exploreButton);
    
    expect(screen.getByText('Seleccionar Norma')).toBeInTheDocument();
  });

  test('displays categories in modal', async () => {
    const user = userEvent.setup();
    render(<NormaAutocomplete />);
    
    await user.click(screen.getByText('Explorar'));
    
    expect(screen.getByText('AGUAS POTABLE - MUESTREO')).toBeInTheDocument();
    expect(screen.getByText('AMBIENTE LABORAL')).toBeInTheDocument();
  });

  test('closes modal when X button is clicked', async () => {
    const user = userEvent.setup();
    render(<NormaAutocomplete />);
    
    await user.click(screen.getByText('Explorar'));
    expect(screen.getByText('Seleccionar Norma')).toBeInTheDocument();
    
    await user.click(screen.getByText('×'));
    expect(screen.queryByText('Seleccionar Norma')).not.toBeInTheDocument();
  });

  test('navigates through categories and subcategories', async () => {
    const user = userEvent.setup();
    render(<NormaAutocomplete />);
    
    await user.click(screen.getByText('Explorar'));
    await user.click(screen.getByText('AMBIENTE LABORAL'));
    
    expect(screen.getByText('Subcategorías')).toBeInTheDocument();
    expect(screen.getByText('AMBIENTE LABORAL')).toBeInTheDocument();
  });

  test('updates input value when norma is selected', async () => {
    const user = userEvent.setup();
    render(<NormaAutocomplete onChange={mockOnChange} />);
    
    await user.click(screen.getByText('Explorar'));
    await user.click(screen.getByText('AMBIENTE LABORAL'));
    await user.click(screen.getByText('AMBIENTE LABORAL'));
    await user.click(screen.getByText('Iluminación - NOM-025-STPS-2008'));
    
    expect(mockOnChange).toHaveBeenCalledWith({
      target: { name: 'norma', value: 'Iluminación - NOM-025-STPS-2008' }
    });
  });
});