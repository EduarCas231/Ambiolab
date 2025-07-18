import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Registro from '../pages/Registro';
import EditI from '../pages/pedidos/EditS';
import RegistroS from '../pages/pedidos/RegistroS';
import Pedidos from '../pages/pedidos/Pedidos';
import Contra from '../pages/Contra';
import News from '../pages/News';
import NewR from '../pages/new/NewR';
import EditN from '../pages/new/EditN';
import Visitas from '../pages/visitas/Visitas'
import Detalles from '../pages/visitas/DetallesV';
import Editar from '../pages/visitas/EditarV';
import Escaner from '../pages/visitas/Escaner';
import Registros from '../pages/visitas/RegistrosV';

// Verifica si el usuario tiene token
const isAuthenticated = () => !!localStorage.getItem('token');

// Ruta privada normal (requiere estar logueado)
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

// Ruta solo para usuarios tipo 1 (admin)
function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const tipo = localStorage.getItem('tipo'); // tipo debe guardarse al iniciar sesión
  return token && tipo === '1' ? children : <Navigate to="/home" replace />;
}

// Ruta para usuarios tipo 1 y 2 (admin y operador)
function AdminOperatorRoute({ children }) {
  const token = localStorage.getItem('token');
  const tipo = localStorage.getItem('tipo');
  return token && (tipo === '1' || tipo === '2') ? children : <Navigate to="/home" replace />;
}

function AdminOrScannerRoute({ children }) {
  const token = localStorage.getItem('token');
  const tipo = localStorage.getItem('tipo');
  return token && (tipo === '1' || tipo === '3') ? children : <Navigate to="/home" replace />;
}


export default function AppNavigator() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/contra" element={<Contra />} />

      {/* Rutas privadas normales */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/edits/:id"
        element={
          <AdminOperatorRoute>
            <EditI />
          </AdminOperatorRoute>
        }
      />
      <Route
        path="/registroS"
        element={
          <AdminOperatorRoute>
            <RegistroS />
          </AdminOperatorRoute>
        }
      />
      <Route
        path="/registros"
        element={
          <AdminOperatorRoute>
            <RegistroS />
          </AdminOperatorRoute>
        }
      />
      {/* Rutas privadas para tipo 1 y 2 */}
      <Route
        path="/pedidos"
        element={
          <AdminOperatorRoute>
            <Pedidos />
          </AdminOperatorRoute>
        }
      />

      {/* Rutas privadas solo para tipo 1 */}

      <Route
        path="/News"
        element={
          <AdminRoute>
            <News />
          </AdminRoute>
        }
      />

      <Route
        path="/NewR"
        element={
          <AdminRoute>
            <NewR />
          </AdminRoute>
        }
      />

      <Route
        path="/EditN"
        element={
          <AdminRoute>
            <EditN />
          </AdminRoute>
        }
      />

      <Route
        path="/EditN/:id"
        element={
          <AdminRoute>
            <EditN />
          </AdminRoute>
        }
      />
      <Route
        path="/visitas"
        element={
          <AdminRoute>
            <Visitas />
          </AdminRoute>
        }
      />
      <Route
        path="/detalles/:id"
        element={
          <AdminRoute>
            <Detalles />
          </AdminRoute>
        }
      />
      <Route
        path="/editar/:id"
        element={
          <AdminRoute>
            <Editar />
          </AdminRoute>
        }
      />
      <Route
        path="/escaner"
        element={
          <AdminOrScannerRoute>
            <Escaner />
          </AdminOrScannerRoute>
        }
      />

      <Route
        path="/registrosV"
        element={
          <AdminRoute>
            <Registros />
          </AdminRoute>
        }
      />

      {/* Redirigir cualquier otra ruta a login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
