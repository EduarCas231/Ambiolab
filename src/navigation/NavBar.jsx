import React, { useState, useEffect } from 'react';
import { useNavigate, Link, NavLink, useLocation } from 'react-router-dom';
import './NavBar.css';
import API from '../config/api';
import { FaHome, FaList, FaQrcode, FaBars, FaTimes } from 'react-icons/fa';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userTipo, setUserTipo] = useState(localStorage.getItem("tipo"));
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      // Solo aplica scroll effect en home
      if (isHomePage) {
        setScrolled(window.scrollY > 10);
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      navigate('/login', { replace: true });
    } catch (error) {
      // Error silencioso durante el cierre de sesión
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Botón menú móvil */}
        {isMobile && (
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
            <span>Menú</span>
          </button>
        )}
        
        {/* Enlaces de navegación */}
        <ul className={`nav-list ${isMobile ? (isMenuOpen ? 'active' : '') : ''}`}>
          <li className="nav-item">
            <NavLink 
              to="/home" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => { if (isMobile) setIsMenuOpen(false); }}
              end
            >
              <FaHome className="nav-icon" />
              <span>Inicio</span>
            </NavLink>
          </li>
          {(userTipo === '1' || userTipo === 1 || userTipo === '2' || userTipo === 2) && (
            <>
              <li className="nav-item">
                <NavLink 
                  to="/pedidos" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => { if (isMobile) setIsMenuOpen(false); }}
                >
                  <FaList className="nav-icon" />
                  <span>Semaforo</span>
                </NavLink>
              </li>
              {(userTipo === '1' || userTipo === 1) && (
                <>
                  <li className="nav-item">
                    <NavLink 
                      to="/news" 
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => { if (isMobile) setIsMenuOpen(false); }}
                    >
                      <FaList className="nav-icon" />
                      <span>Eventos</span>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink 
                      to="/visitas" 
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => { if (isMobile) setIsMenuOpen(false); }}
                    >
                      <FaList className="nav-icon" />
                      <span className="nav-item-content">
                        Visitas
                        {notificacionesCount > 0 && (
                          <span className="notification-badge">{notificacionesCount}</span>
                        )}
                      </span>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/escaner"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => { if (isMobile) setIsMenuOpen(false); }}
                    >
                      <FaQrcode className="nav-icon" />
                      <span>Escaner</span>
                    </NavLink>
                  </li>
                </>
              )}
            </>
          )}
          {isMobile && (
            <li className="nav-item">
              <button onClick={handleLogout} className="logout-btn mobile-logout">
                Cerrar Sesión
              </button>
            </li>
          )}
        </ul>

        {/* Botón logout desktop */}
        {!isMobile && (
          <button onClick={handleLogout} className="logout-btn desktop-logout">
            <span className="logout-text">Cerrar Sesión</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;