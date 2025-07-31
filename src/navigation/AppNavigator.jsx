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
import Users from '../pages/users/Users';
import EditUser from '../pages/users/Edituser';

// Verifica si el usuario tiene token
const isAuthenticated = () => !!localStorage.getItem('token');

// Ruta privada normal (requiere estar logueado)
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

// Ruta solo para usuarios tipo 1 (admin)
function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const tipo = localStorage.getItem('tipo');
  return token && tipo === '1' ? children : <Navigate to="/home" replace />;
}

// Ruta para usuarios tipo 1 y 2 (admin y operadores)
function AdminOperatorRoute({ children }) {
  const token = localStorage.getItem('token');
  const tipo = localStorage.getItem('tipo');
  return token && (tipo === '1' || tipo === '2') ? children : <Navigate to="/home" replace />;
}

// Ruta para semáforo: tipos 1, 2 y 3
function SemaforoRoute({ children }) {
  const token = localStorage.getItem('token');
  const tipo = localStorage.getItem('tipo');
  return token && (tipo === '1' || tipo === '2' || tipo === '3') ? children : <Navigate to="/home" replace />;
}

// Ruta para visitas: tipos 1, 2, 3 y 4
function VisitasRoute({ children }) {
  const token = localStorage.getItem('token');
  const tipo = localStorage.getItem('tipo');
  return token && (tipo === '1' || tipo === '2' || tipo === '3' || tipo === '4') ? children : <Navigate to="/home" replace />;
}

// Ruta para escáner: tipos 1 y 5
function EscanerRoute({ children }) {
  const token = localStorage.getItem('token');
  const tipo = localStorage.getItem('tipo');
  return token && (tipo === '1' || tipo === '5') ? children : <Navigate to="/home" replace />;
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
      
      <Route
        path="/pedidos"
        element={
          <SemaforoRoute>
            <Pedidos />
          </SemaforoRoute>
        }
      />

      <Route
        path="/News"
        element={
          <AdminOperatorRoute>
            <News />
          </AdminOperatorRoute>
        }
      />

      <Route
        path="/NewR"
        element={
          <AdminOperatorRoute>
            <NewR />
          </AdminOperatorRoute>
        }
      />

      <Route
        path="/EditN"
        element={
          <AdminOperatorRoute>
            <EditN />
          </AdminOperatorRoute>
        }
      />

      <Route
        path="/EditN/:id"
        element={
          <AdminOperatorRoute>
            <EditN />
          </AdminOperatorRoute>
        }
      />
      <Route
        path="/visitas"
        element={
          <VisitasRoute>
            <Visitas />
          </VisitasRoute>
        }
      />
      <Route
        path="/detalles/:id"
        element={
          <VisitasRoute>
            <Detalles />
          </VisitasRoute>
        }
      />
      <Route
        path="/editar/:id"
        element={
          <VisitasRoute>
            <Editar />
          </VisitasRoute>
        }
      />
      <Route
        path="/escaner"
        element={
          <EscanerRoute>
            <Escaner />
          </EscanerRoute>
        }
      />

      <Route
        path="/registrosV"
        element={
          <VisitasRoute>
            <Registros />
          </VisitasRoute>
        }
      />

      <Route
        path="/users"
        element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        } 
      />

      <Route
        path="/users/edit/:id"
        element={
          <AdminRoute>
            <EditUser />
          </AdminRoute>
        } 
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
