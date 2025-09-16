import React from 'react';
import '../../../styles/modals/PrintComprobanteModal/PrintComprobanteModal.css';

const PrintComprobanteModal = ({ isOpen, onAccept, onCancel }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="popup-overlay swal2-backdrop-show" onClick={handleOverlayClick}>
      <div className="popup-content swal2-popup swal2-modal swal2-icon-question swal2-show">
        <div className="swal2-header">
          <div className="swal2-icon swal2-question">
            <span className="swal2-icon-content">?</span>
          </div>
          <h2 className="swal2-title">Imprimir Comprobante</h2>
        </div>
        
        <div className="swal2-html-container">
          <p>¿Desea imprimir su factura?</p>
        </div>

        <div className="swal2-actions">
          <button 
            className="swal2-cancel swal2-styled" 
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button 
            className="swal2-confirm swal2-styled" 
            onClick={onAccept}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintComprobanteModal;