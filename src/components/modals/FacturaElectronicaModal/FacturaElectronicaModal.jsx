import React, { useState, useEffect } from 'react';
import { confirmarPagoInterno } from '../../../services/ticketService';
import '../../../styles/modals/FacturaElectronicaModal/FacturaElectronicaModal.css';

const FacturaElectronicaModal = ({ 
  isOpen, 
  onClose, 
  onContinue ,
  ticket,
  type="LP"
}) => {
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [tipoDcto, setTipoDcto] = useState('');
  const [nroDcto, setNroDcto] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [usrId, setUsrId] = useState('');

  // Efecto para manejar el overflow del body cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup al desmontar el componente
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Función para buscar cliente por documento
  const fetchClientByDoc = async (tipoDcto, nroDcto) => {
    try {
      const response = await fetch(`http://localhost:3000/api/client/${tipoDcto}/${nroDcto}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Cliente no encontrado');
      }
    } catch (error) {
      console.error('Error al buscar cliente:', error);
      return null;
    }
  };

  const handleSiClick = () => {
    setShowPersonaModal(true);
  };

  const handleNoClick = async () => {
    try{
      await confirmarPagoInterno(ticket,type);
      onContinue();
    } catch(error){
      console.error('Error al confirmar pago interno:', error);
    }
  };

  const handleCancelButton = () => {
    // Reset states
    setShowPersonaModal(false);
    setShowResultModal(false);
    setTipoDcto('');
    setNroDcto('');
    setName('');
    setEmail('');
    setUsrId('');
    onClose();
  };

  const handleDctoChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    setNroDcto(value);
  };

  const handleSearchClick = async () => {
    if (!tipoDcto || !nroDcto) {
      alert('Por favor seleccione un tipo de documento e ingrese el número');
      return;
    }

    const clientData = await fetchClientByDoc(tipoDcto, nroDcto);
    if (clientData) {
      setName(clientData.name || '');
      setEmail(clientData.email || '');
      setUsrId(clientData.id || '');
      setShowResultModal(true);
    } else {
      alert('Cliente no encontrado');
    }
  };

  const handleClick = () => {
    onContinue();
  };

  const handleClickBack = () => {
    setShowResultModal(false);
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancelButton();
    }
  };

  return (
    <div className="popup-overlay" onClick={handleOverlayClick}>
      <div className="popup-content">
        <h3>Facturación Electrónica</h3>

        {!showPersonaModal && (
          <p>¿Desea recibir factura electrónica a nombre propio?</p>
        )}
        {!showPersonaModal && (
          <div className="popup-button-group">
            <button className="btn btn-outline" onClick={handleSiClick}>Sí</button>
            <button className="btn btn-outline" onClick={handleNoClick}>No</button>
          </div>
        )}

        {showPersonaModal && !showResultModal && (
          <div className='form-fac'>
            <div className='select-content'>
              <label htmlFor="tipo-dcto">Tipo Documento</label>
              <select id="tipo-dcto"
                  onChange={(e)=>{setTipoDcto(e.target.value)}}
                  value={tipoDcto}>
                <option value="">Seleccione un tipo de documento</option>
                <option value="13">CÉDULA DE CIUDADANÍA</option>
                <option value="22">CÉDULA EXTRANJERÍA</option>
                <option value="47">PERMISO PROTECCIÓN TEMPORAL</option>
                <option value="41">PASAPORTE</option>
                <option value="31">NIT</option>
              </select>
            </div>
            <div className='nrodoc-content'>
              <label htmlFor='nro-dcto'>Número Documento</label>
              <input
                type='text'
                value={nroDcto}
                id='nro-dcto'
                maxLength={15}
                onChange={handleDctoChange}/>
            </div>
          </div>
        )}

        {showResultModal && (
          <div className='form-fac'>
            <div className='select-content'>
              <label htmlFor="tipo-dcto">Razón social</label>
              <input
                type='text'
                value={name}
                id='rsocial'
                disabled/>
            </div>
            <div className='nrodoc-content'>
              <label htmlFor='uemail'>Email</label>
              <input
                type='text'
                value={email}
                id='uemail'
                disabled/>
            </div>
          </div>
        )}

        {showPersonaModal && !showResultModal && (
          <div className="popup-button-group">
              <button className="btn btn-outline" onClick={handleNoClick}>Continuar sin sus datos</button>
              <button className="btn btn-primary" onClick={handleSearchClick}>Buscar</button>
            </div>
        )}

        {showResultModal && (
          <div className="popup-button-group">
              <button className="btn btn-outline" onClick={handleClickBack}>Regresar</button>
              <button className="btn btn-primary" onClick={handleClick}>Continuar</button>
            </div>
        )}

        
      </div>
    </div>
  );
};

export default FacturaElectronicaModal;