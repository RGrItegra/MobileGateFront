import React from 'react';
import '../../../styles/modals/FacturaElectronicaModal/FacturaElectronicaModal.css';

const FacturaElectronicaModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="popup-overlay swal2-backdrop-show" onClick={handleOverlayClick}>
      <div className="popup-content swal2-popup swal2-modal swal2-icon-warning swal2-show">
        <div className="swal2-header">
          <div className="swal2-icon swal2-warning">
            <span className="swal2-icon-content">!</span>
          </div>
          <h2 className="swal2-title">Facturación Electrónica</h2>
        </div>
        
        <div className="swal2-html-container">
          <p>Para recibir tu factura debes registrarte</p>
          <a 
            href="https://invoicer.itegra.co/iniciomolinos" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="eb-link"
          >
            aquí
          </a>
        </div>

        <div className="swal2-actions">
          <button 
            className="swal2-confirm swal2-styled" 
            onClick={onClose}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacturaElectronicaModal;