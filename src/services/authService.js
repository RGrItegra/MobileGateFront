// Servicio para manejar la autenticación de usuarios
// Este archivo contiene funciones para iniciar sesión, cerrar sesión y verificar el estado de autenticación

import axios from 'axios';

// URL base para las peticiones de autenticación
// En un entorno real, esto vendría de variables de entorno o configuración
const API_URL = localStorage.getItem('serverUrl') || 'https://api.ejemplo.com';

/**
 * Función para generar un UUID v4
 * @returns {string} - UUID generado
 */
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Función para obtener el UUID del usuario actual o generar uno nuevo
 * @returns {string} - UUID del usuario
 */
export const getUserUUID = () => {
  let uuid = localStorage.getItem('userUUID');
  
  if (!uuid) {
    uuid = generateUUID();
    localStorage.setItem('userUUID', uuid);
  }
  
  return uuid;
};

// Verificamos si hay un UUID al cargar la aplicación
getUserUUID();

/**
 * Función para iniciar sesión
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const loginUser = async (username, password) => {
  try {
    // En un entorno real, esta sería una petición POST a un endpoint de autenticación
    // Por ahora, simulamos una respuesta exitosa después de un breve retraso
    
    // Simulación de petición al servidor
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validación simple para demostración
        if (username === 'admin' && password === 'admin123') {
          const userData = {
            id: 1,
            username: username,
            name: 'Administrador',
            token: 'token-simulado-jwt'
          };
          
          // Guardamos los datos del usuario en localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          
          resolve(userData);
        } else {
          reject({ message: 'Credenciales incorrectas' });
        }
      }, 1000); // Simulamos 1 segundo de retraso
    });
    
    // Implementación real con axios (comentada)
    /*
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    });
    
    if (response.data && response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
    */
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Función para cerrar sesión
 */
export const logoutUser = () => {
  localStorage.removeItem('user');
};

/**
 * Función para obtener el usuario actual
 * @returns {Object|null} - Datos del usuario o null si no hay sesión
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};

/**
 * Función para verificar si el usuario está autenticado
 * @returns {boolean} - true si está autenticado, false en caso contrario
 */
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};