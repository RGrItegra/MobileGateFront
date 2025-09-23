import React from 'react';
import '../../../styles/modals/ErrorModal/ErrorModal.css';

const ErrorModal = ({ isOpen, title, message, onClose, onRetry }) => {
  if (!isOpen) return null;

  return (
    <div className="error-modal-overlay">
      <div className="error-modal-content">
        <div className="error-icon">
          <span>⚠️</span>
        </div>
        
        <h3 className="error-title">{title || 'Error'}</h3>
        
        <p className="error-message">{message}</p>
        
        <div className="error-modal-buttons">
          {onRetry && (
            <button className="error-btn retry-btn" onClick={onRetry}>
              Reintentar
            </button>
          )}
          <button className="error-btn close-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;