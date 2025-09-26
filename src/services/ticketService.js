// Servicio para manejar las consultas de tickets y placas
// Este archivo contiene funciones para consultar información de pagos

import { getCurrentUser } from './authService';


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
    console.log("[FRONT] Iniciando consultarTicket...");
    const currentUser = getCurrentUser();
    console.log("[FRONT] currentUser obtenido:", currentUser);
    if (!currentUser || !currentUser.external || !currentUser.external.token) {
      throw new Error('Usuario no autenticado. Por favor, inicie sesión nuevamente.');
    }

    // Preparar los datos para la consulta
    const consultaData = {
      ticket: inputValue,
      type: inputType === 'placa' ? 'LP' : 'ticket',
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
        totalAPagar: data.price?.amount ?? 0,
        totalNeto: data.netPrice?.amount ?? 0,
        ingresos: data.turnover?.amount ?? 0,
        ingresosNetos: data.netTurnover?.amount ?? 0,
        numeroTarifa: data.rateNumber ?? 0,
        fechaFin: data.dateTimeEnd ?? '-',
        horaFin: data.rateEnd ?? '-',
        reembolsos: data.refounds ?? [],
        // Puedes agregar todos los campos originales que necesites
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
      type: inputType === 'placa' ? 'LP' : 'ticket',
    };

    // Realizar la consulta al endpoint /ticket/status
    const response = await fetch(`${API_URL}/ticket/status/short`, {
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

/**
 * Función para confirmar el pago de un ticket
 * @param {string} ticket - Código o placa
 * @param {string} type - Tipo (ej: 'LP')
 * @param {number} amount - Monto pagado por el cliente
 * @param {string} currencyCode - Código de moneda, por defecto 'COP'
 * @returns {Promise} - Respuesta del backend
 */

export const confirmarPago = async (ticket, type, amount, currencyCode = 'COP') => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.external || !currentUser.external.token) {
      throw new Error('Usuario no autenticado. Por favor, inicie sesión nuevamente.');
    }
    
    const paymentData = {
      ticket,
      type,
      payment: {
        amount,
        currencyCode
      }
    };

    const response = await fetch(`${API_URL}/ticket/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.external.token}`
      },
      body: JSON.stringify(paymentData)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Error  al procesar el pago " }));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("[FRONT] Respuesta backend /payment:", data);

    return { success: true, data };
  } catch (error) {
    console.error("Error en confirmarPago:", error);
    throw error;
  }
}; 