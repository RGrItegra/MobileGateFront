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
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.externalToken) {
      throw new Error('Usuario no autenticado. Por favor, inicie sesión nuevamente.');
    }

    const consultaData = {
      ticket: inputValue,
      type: inputType === 'placa' ? 'LP' : 'ticket',
    };

    const response = await fetch(`${API_URL}/ticket/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.externalToken}`,
      },
      body: JSON.stringify(consultaData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error en la consulta' }));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    const data = await response.json();

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
        ...data,
      },
    };
  } catch (error) {
    console.error('Error en consultarTicket:', error);
    if (error instanceof TypeError) {
      throw new Error('Error de conexión. Verifique que el backend esté ejecutándose.');
    }
    throw error;
  }
};

export const consultarEstadoTicket = async (inputType, inputValue) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.externalToken) {
      throw new Error('Usuario no autenticado. Por favor, inicie sesión nuevamente.');
    }

    const consultaData = {
      ticket: inputValue,
      type: inputType === 'placa' ? 'LP' : 'ticket',
    };

    const response = await fetch(`${API_URL}/ticket/status/short`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.externalToken}`,
      },
      body: JSON.stringify(consultaData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error en la consulta de estado' }));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Error de conexión. Verifique su conexión a internet.');
    }
    throw error;
  }
};

export const confirmarPago = async (ticket, type, amount, currencyCode = 'COP') => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.externalToken) {
      throw new Error('Usuario no autenticado. Por favor, inicie sesión nuevamente.');
    }

    const paymentData = {
      ticket,
      type,
      payment: { amount, currencyCode },
    };

    const response = await fetch(`${API_URL}/ticket/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.externalToken}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error al procesar el pago' }));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error en confirmarPago:', error);
    throw error;
  }
};