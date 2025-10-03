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

    if(data.turnover?.amount){
      sessionStorage.setItem("ticketAmount:" , data.turnover.amount);
    }

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

// Función para confirmar el pago de un ticket
export const confirmarPago = async (ticket, type, amount, currencyCode = 'COP') => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.externalToken) {
      throw new Error('Usuario no autenticado. Por favor, inicie sesión nuevamente.');
    }

    const storedAdmount = sessionStorage.getItem("ticketAmount:");
    if(!storedAdmount){
      throw new Error('No se encontró el monto del ticket en sessionStorage.');
    }

    // 1. Pago en API externa
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
      const errorData = await response.json().catch(() => ({ message: 'Error al procesar el pago externo' }));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    const externalData = await response.json();

    return { success: true, external: externalData};
  } catch (error) {
    console.error('Error en confirmarPago:', error);
    throw error;
  }
};

//confirmar pago en base de datos 
export const confirmarPagoInterno = async(ticket,type) => {
  try {
    const currentUser = getCurrentUser();
    if(!currentUser|| !currentUser.token){
      throw new Error('Usuario no autenticado. Por favor, inicie sesión nuevamente.');
    }
      const storedAdmount = sessionStorage.getItem("ticketAmount:");
      if (!storedAdmount) {
      throw new Error('No se encontró el monto del ticket en sessionStorage.');
    }
    const confirmData = {
      ticket,
      type,
      paymentAmount: storedAdmount,
    };

      const confirmResponse = await fetch(`${API_URL}/payment/payments/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`,
      },
      body: JSON.stringify(confirmData),
    });

      if (!confirmResponse.ok) {
      const errorData = await confirmResponse.json().catch(() => ({ message: 'Error al confirmar en BD interna' }));
      throw new Error(errorData.message || `Error ${confirmResponse.status}`);
    }
    const internalData = await confirmResponse.json();
    sessionStorage.removeItem("ticketAmount:");

    return { success: true, internal: internalData };
  }catch (error) {
    console.error('Error en confirmarPagoInterno:', error);
    throw error;
  }
};