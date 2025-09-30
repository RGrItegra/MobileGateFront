import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../contexts/LoadingContext';
import { consultarTicket} from '../../services/ticketService';
import Header from '../Header/Header';
import ErrorModal from '../modals/ErrorModal/ErrorModal';
import '../../styles/Welcome/Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();
  const { withLoading } = useLoading();
  const [inputType, setInputType] = useState('placa'); // 'placa' o 'codigo'
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [showFacturaModal, setShowFacturaModal] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });

  const validateInput = (value, type) => {
    if (type === 'placa') {
      // Placa: 6 dígitos alfanuméricos (letras y números)
      const placaRegex = /^[A-Za-z0-9]{6}$/;
      return placaRegex.test(value);
    } else {
      // Código: 23 dígitos numéricos
      const codigoRegex = /^[0-9]{23}$/;
      return codigoRegex.test(value);
    }
  };

  const handleInputChange = (e) => {
    let value = e.target.value;
    
    // Filtrar caracteres según el tipo de input
    if (inputType === 'placa') {
      // Solo permitir letras y números, convertir a mayúsculas
      value = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    } else {
      // Solo permitir números para Ticket
      value = value.replace(/[^0-9]/g, '');
    }
    
    setInputValue(value);
    setIsValid(validateInput(value, inputType));
  };

  const handleTypeChange = (type) => {
    setInputType(type);
    setInputValue('');
    setIsValid(false);
  };

  const handleContinue = async () => {
    if (isValid) {
      await withLoading(async () => {
        try {
          // Realizar consulta al backend
          const response = await consultarTicket(inputType, inputValue);
          
          if (response.success) {
            // Navegar a la página de valor a pagar con los datos obtenidos
            navigate('/valor-a-pagar', { 
              state: { 
                inputType, 
                inputValue, 
                paymentData: response.data 
              } 
            });
          } else {
            throw new Error('No se pudo obtener información del ticket/placa');
          }
        } catch (error) {
          console.error('Error al consultar ticket:', error);
          // Mostrar error al usuario usando el modal
          setErrorModal({
            isOpen: true,
            title: 'Error de Consulta',
            message: error.message
          });
        }
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {  
      handleContinue();
    }
  };

  const handleElectronicBilling = () => {
    setShowFacturaModal(true);
  };

  const handleCloseFacturaModal = () => {
    setShowFacturaModal(false);
  };

  const handleCloseErrorModal = () => {
    setErrorModal({ isOpen: false, title: '', message: '' });
  };

  const handleRetryQuery = () => {
    setErrorModal({ isOpen: false, title: '', message: '' });
    handleContinue();
  };

  return (
    <div className="home-container">
      <Header />
      
      <div className="img-container">
        <img src="/Recurso 1.png" alt="Imagen Portada" />
      </div>

      <div className="text-p-container">
        <p>
          Inicie el Proceso de pago <br /> ingresando su {inputType}
        </p>
      </div>

      {/* Selector de tipo de entrada */}
      <div className="input-type-selector">
        <button 
          className={`type-btn ${inputType === 'placa' ? 'active' : ''}`}
          onClick={() => handleTypeChange('placa')}
        >
          Placa
        </button>
        <button 
          className={`type-btn ${inputType === 'codigo' ? 'active' : ''}`}
          onClick={() => handleTypeChange('codigo')}
        >
          Ticket
        </button>
      </div>

      <div className="search-container">
        <input 
          type="text" 
          placeholder={inputType === 'placa' ? 'Ingrese su placa (ej: ABC123)' : 'Ingrese su código de 23 dígitos'}
          maxLength={inputType === 'codigo' ? 23 : 6}
          className="search-input"
          value={inputValue} 
          onChange={handleInputChange} 
          onKeyDown={handleKeyPress} 
        />
        
        <button 
          className="continue-button"
          onClick={handleContinue}
          disabled={!isValid}
        >
          CONTINUAR
        </button>
      </div>

      {/* Modal de Error */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={handleCloseErrorModal}
        onRetry={handleRetryQuery}
      />

    </div>
  );
};

export default Welcome;