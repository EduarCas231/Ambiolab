import React, { useState, useEffect } from 'react';
import { useNavigate, Link, NavLink, useLocation } from 'react-router-dom';
import './NavBar.css';
import API from '../config/api';
import { FaHome, FaList, FaQrcode, FaBars, FaTimes, FaTrafficLight, FaCalendarAlt, FaUsers, FaUserFriends } from 'react-icons/fa';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userTipo, setUserTipo] = useState(localStorage.getItem("tipo"));
  const [notificacionesCount, setNotificacionesCount] = useState(0);

  // Determina si estamos en la página de inicio
  const isHomePage = location.pathname === '/home';

  useEffect(() => {
    // Verificar token al cargar el componente
    const verificarToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.clear();
        navigate('/login', { replace: true });
        return;
      }

      try {
        const response = await fetch(API.auth.verify, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Token inválido');
        }

        const data = await response.json();
        
        // Convertir a string para asegurar la comparación correcta
        setUserTipo(String(data.tipo));
      } catch (error) {
        localStorage.clear();
        navigate('/login', { replace: true });
      }
    };

    verificarToken();
  }, [navigate]);

  // Verificar notificaciones no leídas desde la base de datos
  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const response = await fetch(API.notificaciones.getUnreadCount);
        if (response.ok) {
          const data = await response.json();
          setNotificacionesCount(data.count || 0);
        }
      } catch (error) {
        console.error('Error al obtener contador de notificaciones:', error);
      }
    };

    checkNotifications();
    
    // Verificar cada 10 segundos
    const interval = setInterval(checkNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Solo aplica scroll effect en home
      if (isHomePage) {
        setScrolled(window.scrollY > 10);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      navigate('/login', { replace: true });
    } catch (error) {
      // Error silencioso durante el cierre de sesión
    }
  };

  return (
    <nav className={`navbar ${isHomePage ? (scrolled ? 'scrolled' : 'transparent') : 'solid'}`}>
      <div className="navbar-content">
        {/* Contenedor izquierdo con logo y enlaces */}
        <div className="navbar-left">
          <div>
            <Link to="/home" className="logo">
              <span className="logo-text">AMBIOLAB</span>
            </Link>
          </div>
          <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <NavLink 
              to="/home" 
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              end
            >
              <FaHome className="nav-icon" />
              Inicio
            </NavLink>
            {(userTipo === '1' || userTipo === 1 || userTipo === '2' || userTipo === 2 || userTipo === '3' || userTipo === 3) && (
              <NavLink 
                to="/pedidos" 
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              >
                <FaTrafficLight className="nav-icon" />
                Pedidos
              </NavLink>
            )}
            {(userTipo === '1' || userTipo === 1 || userTipo === '2' || userTipo === 2) && (
              <NavLink 
                to="/news" 
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              >
                <FaCalendarAlt className="nav-icon" />
                Eventos
              </NavLink>
            )}
            {(userTipo === '1' || userTipo === 1 || userTipo === '2' || userTipo === 2 || userTipo === '3' || userTipo === 3 || userTipo === '4' || userTipo === 4) && (
              <NavLink 
                to="/visitas" 
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              >
                <FaUserFriends className="nav-icon" />
                <span className="nav-item-content">
                  Visitas
                  {notificacionesCount > 0 && (
                    <span className="notification-badge">{notificacionesCount}</span>
                  )}
                </span>
              </NavLink>
            )}
            {(userTipo === '1' || userTipo === 1 || userTipo === '5' || userTipo === 5) && (
              <NavLink
                to="/escaner"
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              >
                <FaQrcode className="nav-icon" />
                Escaner
              </NavLink>
            )}
            {(userTipo === '1' || userTipo === 1) && (
              <NavLink
                to="/users"
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              >
                <FaUsers className="nav-icon" />
                Usuarios
              </NavLink>
            )}
            <button onClick={handleLogout} className="logout-btn mobile-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Contenedor derecho con botón de logout */}
        <div className="navbar-right">
          <button onClick={handleLogout} className="logout-btn desktop-logout">
            <span className="logout-text">Cerrar Sesión</span>
          </button>
          
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;