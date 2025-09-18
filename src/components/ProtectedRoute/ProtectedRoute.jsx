import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../Loading/Loading';

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar si está autenticado
 * @returns {React.ReactElement} - Componente protegido o redirección
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <Loading />;
  }

  // Si no está autenticado, redirigir al login con la ubicación actual
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si está autenticado, renderizar los componentes hijos
  return children;
};

export default ProtectedRoute;