import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '../services/authService';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay un usuario autenticado al cargar la aplicación
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error al verificar estado de autenticación:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Función para iniciar sesión
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      // Llamar al servicio de logout
      logoutUser();
      
      // Limpiar el estado
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error durante logout:', error);
      // Forzar logout local en caso de error
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Función para actualizar los datos del usuario
  const updateUser = (userData) => {
    setUser(userData);
    // Actualizar también en localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Verificar periódicamente si el token sigue siendo válido
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
          // Si no hay usuario en localStorage, hacer logout
          logout();
        }
      }, 60000); // Verificar cada minuto

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;