import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/EditS.css';
import NormaAutocomplete from '../../components/NormaAutocomplete';
import API from '../../config/api';

const EditS = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ot: '',
    nombre: '',
    norma: '',
    parametros: '',
    estatus: 'pendiente',
    fecha_inicio: '',
    fecha_final: '',
    comentario: '',
    precio: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const formatDateInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return '';
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const fetchPedido = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API.pedidos.getById(id));
        if (!response.ok) throw new Error('Error al obtener el pedido');

        const data = await response.json();

        setFormData({
          ot: data.ot ?? '',
          nombre: data.nombre ?? '',
          norma: data.norma ?? '',
          parametros: data.parametros ?? '',
          estatus: data.estatus ?? 'pendiente',
          fecha_inicio: formatDateInput(data.fecha_inicio),
          fecha_final: formatDateInput(data.fecha_final),
          comentario: data.comentario ?? '',
          precio: data.precio !== null && data.precio !== undefined ? data.precio : ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedido();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');

    try {
      setIsLoading(true);
      const response = await fetch(API.pedidos.update(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el pedido');
      }

      navigate('/pedidos', { state: { success: 'Pedido actualizado correctamente' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando información del pedido...</p>
      </div>
    );
  }

  return (
    <div className="edit-container">
      <div className="edit-header">
        <h2>Editar Pedido</h2>
        <button onClick={() => navigate('/pedidos')} className="back-button">
          Volver a Pedidos
        </button>
      </div>

      <div className="edit-card">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="ot">OT</label>
            <input
              type="text"
              id="ot"
              name="ot"
              placeholder="Ingrese el número de OT"
              required
              value={formData.ot}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="nombre">Cliente</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Ingrese el nombre del cliente"
              required
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="norma">Norma</label>
            <NormaAutocomplete
              value={formData.norma}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="parametros">Parámetros</label>
            <textarea
              id="parametros"
              name="parametros"
              placeholder="Ingrese los parámetros del análisis..."
              rows="3"
              value={formData.parametros}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estatus">Estatus</label>
              <select 
                id="estatus" 
                name="estatus" 
                value={formData.estatus} 
                onChange={handleChange}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="completado">Completado</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="precio">Precio ($)</label>
              <input
                type="number"
                id="precio"
                name="precio"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.precio}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fecha_inicio">Fecha de Inicio</label>
              <input
                type="date"
                id="fecha_inicio"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fecha_final">Fecha Final</label>
              <input
                type="date"
                id="fecha_final"
                name="fecha_final"
                value={formData.fecha_final}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="comentario">Observaciones</label>
            <textarea
              id="comentario"
              name="comentario"
              placeholder="Ingrese cualquier observación relevante..."
              rows="4"
              value={formData.comentario}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditS;