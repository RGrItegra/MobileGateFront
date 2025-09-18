import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Loading from '../Loading/Loading';
import '../../styles/ConfirmacionPago/ConfirmacionPago.css';

const ConfirmacionPago = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFacturaModal, setShowFacturaModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Obtener datos de confirmación desde la navegación
  const confirmationData = location.state?.confirmationData || {
    vehicleInfo: { plate: 'ABC 123' },
    amount: 5000,
    paymentMethod: 'EFECTIVO',
    date: new Date().toLocaleDateString()
  };

  const handleConfirmarPago = () => {
    setShowFacturaModal(true);
  };

  const handleFacturaResponse = (wantsFactura) => {    console.log('handleFacturaResponse iniciado');
    setShowFacturaModal(false);
    setLoading(true);
    
    // Simular procesamiento de pago
    setTimeout(() => {
      setLoading(false);
      setPaymentSuccess(true);
      
      // Mostrar mensaje de éxito y luego navegar al welcome
      setTimeout(() => {
        console.log('Navegando a welcome');
        navigate('/welcome');
      }, 2000);
    }, 3000);
  };

  const handleVolver = () => {
    navigate('/welcome');
  };

  if (loading) {
    return <Loading />;
  }

  if (paymentSuccess) {
    return (
      <div className="confirmacion-pago-page">
        <Header />
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2 className="success-title">¡Pago Exitoso!</h2>
          <p className="success-message">Tu transacción ha sido procesada correctamente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmacion-pago-page">
      {/* Header Component */}
      <Header />

      {/* Imagen del auto - más grande */}
      <div className="img-container-large">
        <img src="/Recurso 42.png" alt="Car illustration" />
      </div>

      {/* Contenido de confirmación - ahora como página, no modal */}
      <div className="confirmation-card">
        <p className="details-title">Detalle del servicio:</p>
        
        <div className="summary-row2">
          <span>Estacionamiento</span>
          <span>$5000</span>
        </div>
        
        <div className="summary-row2">
          <span>Forma de Pago</span>
          <span>EFECTIVO</span>
        </div>
        
        <div className="summary-row2">
          <span>Fecha:</span>
          <span>{confirmationData.date}</span>
        </div>
        
        <div className="summary-row2 total-row">
          <span>Total</span>
          <span>$5000 COP</span>
        </div>
      </div>

      <div className="button-wrapper">
        <button className="btn btn-primary" onClick={handleConfirmarPago}>
          CONFIRMAR Y PAGAR
        </button>
      </div>

      {/* Botón volver - no sticky */}
      <div className="back-button-container">
        <button className="back-button" onClick={handleVolver}>
          Volver
        </button>
      </div>

      {/* Modal de facturación electrónica */}
      {showFacturaModal && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Facturación Electrónica</h3>
            <p>¿Desea recibir factura electrónica?</p>
            
            <div className="popup-button-group">
              <button className="btn" onClick={() => handleFacturaResponse(true)}>
                SÍ
              </button>
              <button className="btn" onClick={() => handleFacturaResponse(false)}>
                NO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmacionPago;