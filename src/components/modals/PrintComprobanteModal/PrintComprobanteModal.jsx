import React from 'react';
import '../../../styles/modals/PrintComprobanteModal/PrintComprobanteModal.css';

const PrintComprobanteModal = ({ isOpen, onAccept, onCancel }) => {
  // console.log('PrintComprobanteModal rendered with isOpen:', isOpen);
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="print-modal-overlay" onClick={handleOverlayClick}>
      <div className="print-modal-content">
        <div className="print-modal-header">
          <h3 className="print-modal-title">Imprimir Comprobante</h3>
        </div>
        
        <div className="print-modal-body">
          <p>¿Desea imprimir su factura?</p>
        </div>

        <div className="print-modal-actions">
          <button 
            className="print-modal-btn print-modal-btn-cancel" 
            onClick={onCancel}
          >
            No
          </button>
          <button 
            className="print-modal-btn print-modal-btn-confirm" 
            onClick={onAccept}
          >
            Sí
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintComprobanteModal;