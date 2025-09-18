import React from 'react';
import '../../../styles/modals/UserDataModal/UserDataModal.css';

const UserDataModal = ({ isOpen, type, message, onClose, showLoading = false }) => {
  if (!isOpen) {
    return null;
  }
  ;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !showLoading) {
      onClose();
    }
  };

  const getIconClass = () => {
    switch (type) {
      case 'success':
        return 'swal2-success';
      case 'error':
        return 'swal2-error';
      case 'loading':
        return 'swal2-info';
      default:
        return 'swal2-info';
    }
  };

  const getIconContent = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#a5dc86" strokeWidth="2" fill="none"/>
            <path d="m9 12 2 2 4-4" stroke="#a5dc86" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'error':
        return (
          <svg className="icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#f27474" strokeWidth="2" fill="none"/>
            <path d="m15 9-6 6" stroke="#f27474" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="m9 9 6 6" stroke="#f27474" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'loading':
        return (
          <svg className="icon-svg loading-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="2"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#3fc3ee" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'success':
        return 'Inicio de Sesión Exitoso';
      case 'error':
        return 'Credenciales Inválidas';
      case 'loading':
        return 'Iniciando Sesión...';
      default:
        return 'Información';
    }
  };

  return (
    <div className="popup-overlay swal2-backdrop-show" onClick={handleOverlayClick}>
      <div className={`popup-content swal2-popup swal2-modal swal2-icon-${type} swal2-show`}>
        <div className="swal2-header">
          <div className={`swal2-icon ${getIconClass()}`}>
            {getIconContent()}
          </div>
          <h2 className="swal2-title">{getTitle()}</h2>
        </div>
        
        <div className="swal2-html-container">
          <p>{message}</p>
        </div>

        {!showLoading && (
          <div className="swal2-actions">
            <button 
              className="swal2-confirm swal2-styled" 
              onClick={onClose}
            >
              Entendido
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDataModal;