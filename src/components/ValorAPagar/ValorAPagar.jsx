import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import PrintComprobanteModal from '../modals/PrintComprobanteModal/PrintComprobanteModal';
import '../../styles/ValorAPagar/ValorAPagar.css';
import { consultarTicket } from '../../services/ticketService';

const ValorAPagar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { inputType, inputValue, statusResponse } = location.state || {};

  // console.info(rateResponse);

  // Estado para los datos de pago, mapeando solo los campos que necesitamos
  const [paymentData, setPaymentData] = useState({
    placa: '',
    nroTicket: '',
    horaIngreso: '',
    duracionEstadia: '',
    costoParqueadero: 0,
    totalAPagar: 0,
    procesamiento: 0,
    inputType
  });

  // Estado para el modal de impresión
  const [showPrintModal, setShowPrintModal] = useState(false);

  const formatHour24 = (date) => {
    if (!date) return '-';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const formatDuration = (start, end) => {
    if (!start || !end) return '-';
    const diffMs = end - start;
    const diffMinsTotal = Math.floor(diffMs / (1000 * 60));
    const diffDays = Math.floor(diffMinsTotal / (60 * 24));
    const diffHrs = Math.floor((diffMinsTotal % (60 * 24)) / 60);
    const diffMins = diffMinsTotal % 60;
    return `${diffDays > 0 ? diffDays + 'd ' : ''}${diffHrs}h ${diffMins}m`;
  };

  // Función para formatear la placa con espacios entre caracteres
  const formatPlaca = (placa) => {
    return placa.split('').join(' ');
  };

  // Mapeo combinando ambas APIs
  const mapBackendData = (rateData, statusData) => {
    const now = new Date();

    const dateTimeStart = statusData?.inputDate ? new Date(statusData.inputDate) : null;

    if (statusData?.nroTicket)

      return {
        placa: statusData?.plate || '',
        nroTicket: statusData?.nroTicket || '',
        horaIngreso: formatHour24(dateTimeStart),
        duracionEstadia: formatDuration(dateTimeStart, now),
        costoParqueadero: rateData?.turnover?.amount ?? 0,
        totalAPagar: rateData?.turnover?.amount ?? 0,
        procesamiento: 0,
        inputType
      };
  };

  const hasFetched = useRef(false);
  // Actualizamos los datos al recibir la info del backend
  useEffect(() => {
    if (!hasFetched.current) {

      hasFetched.current = true;

      const fetchPaymentData = async () => {
        try {
          //const ticketRateResponse = await consultarTicket(inputType, inputValue);
          const rateResponse = await consultarTicket(inputType, inputValue);

          if (rateResponse.success) {

            sessionStorage.setItem("rate", JSON.stringify(rateResponse.data));

            setPaymentData(mapBackendData(rateResponse.data, statusResponse));
          }
        } catch (error) {

          if (
            error.message === "Token expiro" ||
            error.message === "Usuario no autenticado , Inicie sesión nuevamente." ||
            error.message.includes("401")
          ) {
            sessionStorage.clear();
            navigate("/login");
            return;
          }
          console.error("Error al obtener el pago:", error)
          navigate('/login');
        }
      };
      fetchPaymentData();
    }
  }, []);


  const handleContinuarPago = () => {
    // Navegar a la página de confirmación de pago
    const confirmationData = {
      ticket: paymentData.nroTicket,
      placa: paymentData.placa,
      estacionamiento: paymentData.totalAPagar,
      transaccionDigital: paymentData.procesamiento,
      formaPago: 'Efectivo',
      fecha: new Date().toLocaleDateString('es-CO'),
      total: paymentData.totalAPagar + paymentData.procesamiento,
      type: inputType
    };

    navigate('/confirmacion-pago', {
      state: { paymentData: confirmationData }
    });
  };

  const handlePrintAccept = () => {
    // console.log('Imprimiendo comprobante...');
    setShowPrintModal(false);
    // Aquí se podría implementar la lógica de impresión real
    alert('Comprobante enviado a impresión');
  };

  const handlePrintCancel = () => {
    setShowPrintModal(false);
    // Redirigir a la página principal después de cancelar
    navigate('/welcome');
  };

  const handleVolver = () => {
    navigate('/welcome');
  };

  return (
    <div className="valor-a-pagar-container">
      {/* Header con logo y título */}
      <Header />

      {/* Ilustración principal */}
      <div className="main-illustration">
        <img
          src="/Recurso 37.png"
          alt="Mobile Payment Illustration"
          className="payment-illustration"
        />
      </div>

      {/* Información del pago */}
      <div className="payment-info-card">
        {/* Badge de placa */}
        <div className="placa-badge">
          <span className="placa-number" title={paymentData.nroTicket}>{paymentData.nroTicket}</span>
        </div>

        {/* Detalles del pago */}
        <div className="payment-details">
          <div className="detail-row">
            <span className="detail-label">Hora de Ingreso:</span>
            <span className="detail-value">{paymentData.horaIngreso}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Duración Estadía:</span>
            <span className="detail-value">{paymentData.duracionEstadia}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Costo Parqueadero:</span>
            <span className="detail-value">$ {paymentData.costoParqueadero}</span>
          </div>
          <div className="detail-row total-row">
            <span className="detail-label">Total a pagar:</span>
            <span className="detail-value total-amount">$ {paymentData.totalAPagar}</span>
          </div>

          {/* Nota de procesamiento 
          <div className="processing-note">
            Incluye ${paymentData.procesamiento} por procesamiento de pago
          </div>
          */}
        </div>
      </div>

      {/* Botón de continuar pago */}
      {paymentData.costoParqueadero > 0 && (
        <div className="continue-payment-section">
          <button className="continue-payment-btn" onClick={handleContinuarPago}>
            <div className="btn-icon">
              <img src="/Recurso 25.png" className='PayIcon' alt="Pay Icon" />
            </div>
            <div className="btn-content">
              <span className="btn-title">Continuar Pago</span>
              <span className="btn-subtitle">Pago rápido y seguro</span>
            </div>
          </button>
        </div>
      )}


      {/* Modal de impresión de comprobante */}
      <PrintComprobanteModal
        isOpen={showPrintModal}
        onAccept={handlePrintAccept}
        onCancel={handlePrintCancel}
      />
    </div>
  );
};

export default ValorAPagar;