// Contexto para manejar el estado de loading globalmente
import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const LoadingContext = createContext();

// Hook personalizado para usar el contexto de loading
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading debe ser usado dentro de un LoadingProvider');
  }
  return context;
};

// Proveedor del contexto de loading
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Función para mostrar el loading
  const showLoading = () => {
    setIsLoading(true);
  };

  // Función para ocultar el loading
  const hideLoading = () => {
    setIsLoading(false);
  };

  // Función para ejecutar una acción con loading automático
  const withLoading = async (asyncFunction) => {
    try {
      showLoading();
      const result = await asyncFunction();
      return result;
    } catch (error) {
      throw error;
    } finally {
      hideLoading();
    }
  };

  const value = {
    isLoading,
    showLoading,
    hideLoading,
    withLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};