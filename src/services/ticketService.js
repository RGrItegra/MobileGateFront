// Servicio para manejar las consultas de tickets y placas
// Este archivo contiene funciones para consultar información de pagos

import { getCurrentUser, getUserUUID } from './authService';

// URL base para las peticiones
const API_URL = localStorage.getItem('serverUrl') || 'http://localhost:3000';

/**
 * Función para consultar información de un ticket o placa
 * @param {string} inputType - Tipo de consulta: 'placa' o 'codigo'
 * @param {string} inputValue - Valor de la placa o código del ticket
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const consultarTicket = async (inputType, inputValue) => {
  try {
    // Obtener datos del usuario autenticado
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.external || !currentUser.external.token) {
      throw new Error('Usuario no autenticado. Por favor, inicie sesión nuevamente.');
    }

    // Preparar los datos para la consulta
    const consultaData = {
      ticket: inputValue,
      type: inputType === 'placa' ? 'plate' : 'ticket',
      uuid: getUserUUID()
    };

    console.log('Consultando ticket:', consultaData);

    // Realizar la consulta al endpoint /ticket/rate
    const response = await fetch(`${API_URL}/ticket/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.external.token}`
      },
      body: JSON.stringify(consultaData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Error de conexión con el servidor" }));
      
      // Manejar diferentes tipos de errores
      if (response.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      } else if (response.status === 404) {
        throw new Error('No se encontró información para esta placa/ticket.');
      } else if (response.status === 500) {
        throw new Error('Error interno del servidor. Contacte al equipo de backend.');
      }
      
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Respuesta del backend:', data);
    
    // Transformar los datos del backend al formato esperado por el frontend
    return {
      success: true,
      data: {
        placa: inputValue,
        horaIngreso: data.entryTime || '12:57',
        duracionEstadia: data.duration || '3d 3h 32m',
        costoParqueadero: data.parkingCost || data.amount || 500,
        totalAPagar: data.totalAmount || data.amount || 500,
        procesamiento: data.processingFee || 0,
        // Datos adicionales que puedan venir del backend
        ...data
      }
    };
  } catch (error) {
    console.error('Error en consultarTicket:', error);
    
    if (error instanceof TypeError) {
      throw new Error("Error de conexión. Verifique que el backend esté ejecutándose.");
    }
    
    // Re-lanzar el error para que sea manejado por el componente
    throw error;
  }
};

/**
 * Función para consultar el estado de un ticket
 * @param {string} inputType - Tipo de consulta: 'placa' o 'codigo'
 * @param {string} inputValue - Valor de la placa o código del ticket
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const consultarEstadoTicket = async (inputType, inputValue) => {
  try {
    // Obtener datos del usuario autenticado
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.external || !currentUser.external.token) {
      throw new Error('Usuario no autenticado o token no disponible');
    }

    // Preparar los datos para la consulta
    const consultaData = {
      ticket: inputValue,
      type: inputType === 'placa' ? 'plate' : 'ticket',
      uuid: currentUser.devUuid || currentUser.uuid
    };

    // Realizar la consulta al endpoint /ticket/status
    const response = await fetch(`${API_URL}/ticket/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.external.token}`
      },
      body: JSON.stringify(consultaData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Error de conexión" }));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Error de conexión. Verifique su conexión a internet.");
    }
    throw error;
  }
};