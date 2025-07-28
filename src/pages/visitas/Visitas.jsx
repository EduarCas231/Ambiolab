import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiEye, FiPlus, FiSearch, FiClock, FiCheckCircle, FiBell } from 'react-icons/fi';
import Swal from 'sweetalert2';
import '../../styles/Visitas.css';
import API from '../../config/api';
import NavBar from '../../navigation/NavBar';

const Visitas = () => {
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [notificaciones, setNotificaciones] = useState([]);
  const visitsPerPage = 10;

  
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroHora, setFiltroHora] = useState('');
  const [filtroDepartamento, setFiltroDepartamento] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  const navigate = useNavigate();

  const fetchVisitas = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API.visitas.getAll);

      if (!response.ok) throw new Error('Error al obtener los datos');

      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Formato inesperado de datos recibidos');
      }

      
      await fetchNotificaciones();

      setVisitas(data.data);
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: 'Error',
        text: err.message,
        icon: 'error',
        confirmButtonColor: '#2b91e7'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitas();
    fetchNotificaciones();
   
    const interval = setInterval(() => {
      fetchVisitas();
      fetchNotificaciones();
    }, 100000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotificaciones = async () => {
    try {
      const response = await fetch(API.notificaciones.getAll);
      if (response.ok) {
        const data = await response.json();
        setNotificaciones(data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  const limpiarNotificaciones = async () => {
    try {
      const response = await fetch(API.notificaciones.markAllAsRead, {
        method: 'PUT'
      });
      if (response.ok) {
        setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
      }
    } catch (error) {
      console.error('Error al marcar notificaciones como leídas:', error);
    }
  };

  const handleRegistroVisita = () => navigate('/registrosV');
  const handleEditar = (id) => navigate(`/editar/${id}`);
  const handleDetalle = (id) => navigate(`/detalles/${id}`);

  const handleBorrar = async (id) => {
    const confirmResult = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2b91e7',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmResult.isConfirmed) {
      try {
        console.log('Intentando eliminar visita ID:', id);
        
       
        const notificacionesRelacionadas = notificaciones.filter(n => n.visita_id == id);
        console.log('Notificaciones a eliminar:', notificacionesRelacionadas.length);
        
        for (const notif of notificacionesRelacionadas) {
          try {
            await fetch(`https://189.136.60.147/notificaciones/${notif.id}`, {
              method: 'DELETE',
            });
            console.log(`Notificación ${notif.id} eliminada`);
          } catch (error) {
            console.warn(`Error eliminando notificación ${notif.id}:`, error);
          }
        }
        
       
        const response = await fetch(API.visitas.delete(id), {
          method: 'DELETE',
        });

        console.log('Respuesta del servidor:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error del servidor:', errorText);
          throw new Error(`Error ${response.status}: ${errorText}`);
        }

        setVisitas(visitas.filter((visita) => visita.id !== id));
        fetchNotificaciones();
        
        Swal.fire({
          title: '¡Eliminado!',
          text: 'La visita ha sido eliminada.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error completo:', error);
        Swal.fire({
          title: 'Error',
          text: error.message || 'No se pudo eliminar la visita',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2b91e7'
        });
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC' 
      };
      return date.toLocaleDateString('es-MX', options)
        .replace(/\b\w/g, l => l.toUpperCase());
    } catch {
      return 'Fecha inválida';
    }
  };

  const visitasFiltradas = visitas.filter((visita) => {
    const nombreCompleto = `${visita.nombre} ${visita.apellidoPaterno} ${visita.apellidoMaterno}`.toLowerCase();
    const horaVisita = visita.hora?.substring(0, 5) || '';

    const filtroNombreOk = nombreCompleto.includes(filtroNombre.trim().toLowerCase());
    const filtroHoraOk = horaVisita.includes(filtroHora.trim());
    const filtroDepartamentoOk = visita.departamento?.toLowerCase().includes(filtroDepartamento.trim().toLowerCase()) ?? true;
    const filtroFechaOk = filtroFecha ? visita.dia === filtroFecha : true;

    return filtroNombreOk && filtroHoraOk && filtroDepartamentoOk && filtroFechaOk;
  });

  
  const indexOfLastVisit = currentPage * visitsPerPage;
  const indexOfFirstVisit = indexOfLastVisit - visitsPerPage;
  const currentVisits = visitasFiltradas.slice(indexOfFirstVisit, indexOfLastVisit);
  const totalPages = Math.ceil(visitasFiltradas.length / visitsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [filtroNombre, filtroHora, filtroDepartamento, filtroFecha]);

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p>Cargando visitas...</p>
    </div>
  );

  if (error) return (
    <div className="error-screen">
      <div className="error-card">
        <h2>Error al cargar datos</h2>
        <p>{error}</p>
        <button className="retry-btn" onClick={fetchVisitas}>
          Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <>
      <NavBar />
      <br />
      <br />
      <br />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-title">
            <h1>Registro de Visitas</h1>
          </div>
          <div className="header-actions">
            {notificaciones.filter(n => !n.leida).length > 0 && (
              <div className="notifications-container">
                <button className="notification-btn" onClick={() => {
                  const notifTexts = notificaciones.filter(n => !n.leida).map(n => n.mensaje).join('\n');
                  Swal.fire({
                    title: 'Nuevos Ingresos',
                    text: notifTexts,
                    icon: 'info',
                    confirmButtonColor: '#2b91e7',
                    showCancelButton: true,
                    confirmButtonText: 'Marcar como leídas',
                    cancelButtonText: 'Cerrar'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      limpiarNotificaciones();
                    }
                  });
                }}>
                  <FiBell className="btn-icon" />
                  <span className="notification-badge">{notificaciones.filter(n => !n.leida).length}</span>
                </button>
              </div>
            )}
            <button className="primary-btn add-btn" onClick={handleRegistroVisita}>
              <FiPlus className="btn-icon" /> Nueva Visita
            </button>
          </div>
        </div>

        <div className="stats-badge">
          <span>{visitasFiltradas.length} visitas encontradas</span>
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <FiSearch className="filter-icon" />
            <input
              type="text"
              placeholder="Nombre del visitante"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <FiClock className="filter-icon" />
            <input
              type="text"
              placeholder="Hora (HH:MM)"
              value={filtroHora}
              onChange={(e) => setFiltroHora(e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <FiSearch className="filter-icon" />
            <input
              type="text"
              placeholder="Departamento"
              value={filtroDepartamento}
              onChange={(e) => setFiltroDepartamento(e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="filter-input date-input"
            />
          </div>
        </div>

        <div className="data-card">
          
          <div className="table-responsive">
            <table className="visitas-table">
              <thead className="visitas-table-header">
                <tr>
                  <th className="visitas-table-header-cell">Visitante</th>
                  <th className="visitas-table-header-cell">Lugar</th>
                  <th className="visitas-table-header-cell">Hora</th>
                  <th className="visitas-table-header-cell">Fecha</th>
                  <th className="visitas-table-header-cell">Departamento</th>
                  <th className="visitas-table-header-cell">Estado</th>
                  <th className="visitas-table-header-cell">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentVisits.length > 0 ? (
                  currentVisits.map(visita => (
                    <tr key={visita.id} className={`visitas-table-row ${visita.escaneado ? 'escaneada' : ''}`}>
                      <td className="visitas-table-cell">
                        {`${visita.nombre} ${visita.apellidoPaterno} ${visita.apellidoMaterno}`}
                      </td>
                      <td className="visitas-table-cell">{visita.lugar || '-'}</td>
                      <td className="visitas-table-cell">{visita.hora?.substring(0, 5) || '-'}</td>
                      <td className="visitas-table-cell">{formatDate(visita.dia)}</td>
                      <td className="visitas-table-cell">{visita.departamento || '-'}</td>
                      <td className="visitas-table-cell">
                        {visita.escaneado ? (
                          <span className="status-badge ingresado">
                            <FiCheckCircle /> Ingresó
                          </span>
                        ) : (
                          <span className="status-badge pendiente">Pendiente</span>
                        )}
                      </td>
                      <td className="visitas-table-cell visitas-action-cell">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEditar(visita.id)}
                          title="Editar"
                        >
                          <FiEdit />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleBorrar(visita.id)}
                          title="Eliminar"
                        >
                          <FiTrash2 />
                        </button>
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleDetalle(visita.id)}
                          title="Detalles"
                        >
                          <FiEye />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-data-row">
                    <td colSpan="7">
                      <div className="no-data-message">
                        No se encontraron visitas con los filtros actuales
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          
          <div className="visitas-cards">
            {currentVisits.length > 0 ? (
              currentVisits.map(visita => (
                <div key={visita.id} className={`visita-card ${visita.escaneado ? 'escaneada' : ''}`}>
                  <div className="card-row">
                    <span className="card-label">Visitante:</span>
                    <span className="card-value">
                      {`${visita.nombre} ${visita.apellidoPaterno} ${visita.apellidoMaterno}`}
                    </span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">Lugar:</span>
                    <span className="card-value">{visita.lugar || '-'}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">Hora:</span>
                    <span className="card-value">{visita.hora?.substring(0, 5) || '-'}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">Fecha:</span>
                    <span className="card-value">{formatDate(visita.dia)}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">Departamento:</span>
                    <span className="card-value">{visita.departamento || '-'}</span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">Estado:</span>
                    <span className="card-value">
                      {visita.escaneado ? (
                        <span className="status-badge ingresado">
                          <FiCheckCircle /> Ingresó
                        </span>
                      ) : (
                        <span className="status-badge pendiente">Pendiente</span>
                      )}
                    </span>
                  </div>
                  <div className="card-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditar(visita.id)}
                      title="Editar"
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleBorrar(visita.id)}
                      title="Eliminar"
                    >
                      <FiTrash2 />
                    </button>
                    <button
                      className="action-btn view-btn"
                      onClick={() => handleDetalle(visita.id)}
                      title="Detalles"
                    >
                      <FiEye />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data-message">
                No se encontraron visitas con los filtros actuales
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Visitas;