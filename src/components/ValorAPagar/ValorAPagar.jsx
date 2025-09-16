import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import PrintComprobanteModal from '../modals/PrintComprobanteModal/PrintComprobanteModal';
import '../../styles/ValorAPagar/ValorAPagar.css';

const ValorAPagar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { inputType, inputValue } = location.state || {};
  
  // Datos simulados del pago basados en las imágenes
  const [paymentData] = useState({
    placa: inputValue || 'JSS913',
    horaIngreso: '12:57',
    duracionEstadia: '3d 3h 32m',
    costoParqueadero: 500,
    totalAPagar: 500,
    procesamiento: 0
  });

  // Estado para el modal de impresión
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handleContinuarPago = () => {
    // Simular proceso de pago exitoso
    setPaymentCompleted(true);
    setShowPrintModal(true);
  };

  const handlePrintAccept = () => {
    console.log('Imprimiendo comprobante...');
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
          <span className="car-icon">🚗</span>
          <span className="placa-label">Placa</span>
          <span className="placa-number">{paymentData.placa}</span>
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
          
          {/* Nota de procesamiento */}
          <div className="processing-note">
            Incluye ${paymentData.procesamiento} por procesamiento de pago
          </div>
        </div>
      </div>

      {/* Botón de continuar pago */}
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