import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../contexts/LoadingContext';
import Header from '../Header/Header';
import FacturaElectronicaModal from '../modals/FacturaElectronicaModal/FacturaElectronicaModal';
import '../../styles/Welcome/Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();
  const { withLoading } = useLoading();
  const [inputType, setInputType] = useState('placa'); // 'placa' o 'codigo'
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [showFacturaModal, setShowFacturaModal] = useState(false);

  const validateInput = (value, type) => {
    if (type === 'placa') {
      // Placa: 6 dígitos alfanuméricos (letras y números)
      const placaRegex = /^[A-Za-z0-9]{6}$/;
      return placaRegex.test(value);
    } else {
      // Código: 6 dígitos numéricos
      const codigoRegex = /^[0-9]{6}$/;
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
      // Solo permitir números para código
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
        // Simular tiempo de carga para mostrar la animación
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Navegar a la página de valor a pagar
        navigate('/valor-a-pagar', { state: { inputType, inputValue } });
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
          Código
        </button>
      </div>

      <div className="search-container">
        <input 
          type="text" 
          placeholder={inputType === 'placa' ? 'Ingrese su placa (ej: ABC123)' : 'Ingrese su código (ej: 123456)'}
          maxLength={6}
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

      {/* Botón facturación electrónica */}
      <div className="billing-section">
        <button className="eb-toggle-button" aria-label="Facturación electrónica" onClick={handleElectronicBilling}>
          <span className="eb-toggle-text">Facturación Electronica</span>
        </button>
      </div>

      {/* Modal de Facturación Electrónica */}
      <FacturaElectronicaModal 
        isOpen={showFacturaModal}
        onClose={handleCloseFacturaModal}
      />
    </div>
  );
};

export default Welcome;