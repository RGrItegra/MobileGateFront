
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser as getStoredUser, logoutUser as logoutStorage } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getStoredUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      logoutStorage(); // limpia sessionStorage
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    // Guardar en sessionStorage para mantener coherencia
    try {
      sessionStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      console.error('No se pudo actualizar sessionStorage en updateUser', e);
    }
  };

  // Verificación periódica: si sessionStorage fue borrado (ej. tab cerrado en otra ventana)
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      const current = getStoredUser();
      if (!current) {
        // Session borrada desde otro lado => hacer logout local
        setUser(null);
        setIsAuthenticated(false);
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const value = { user, isAuthenticated, isLoading, login, logout, updateUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
