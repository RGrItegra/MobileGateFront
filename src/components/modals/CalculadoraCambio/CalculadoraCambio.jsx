import React, { useState, useEffect } from 'react';
import '../../../styles/modals/CalculadoraCambio/CalculadoraCambio.css';

const CalculadoraCambio = ({ isOpen, onClose, onConfirm, totalAmount }) => {
  const [dineroEntregado, setDineroEntregado] = useState('');
  const [cambio, setCambio] = useState(0);
  
  // Billetes predeterminados
  const billetes = [5000, 10000, 20000, 50000, 100000];

  useEffect(() => {
    if (dineroEntregado && !isNaN(dineroEntregado)) {
      const entregado = parseFloat(dineroEntregado);
      const cambioCalculado = entregado - totalAmount;
      setCambio(cambioCalculado >= 0 ? cambioCalculado : 0);
    } else {
      setCambio(0);
    }
  }, [dineroEntregado, totalAmount]);

  const handleBilleteClick = (valor) => {
    setDineroEntregado(valor.toString());
  };

  const handleCompletoClick = () => {
    setDineroEntregado(totalAmount.toString());
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Solo permitir números
    if (value === '' || /^\d+$/.test(value)) {
      setDineroEntregado(value);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleConfirmar = () => {
    if (parseFloat(dineroEntregado) >= totalAmount) {
      const paymentData = {
        total: totalAmount,
        entregado: parseFloat(dineroEntregado),
        cambio: cambio
      };
      console.log('Pago confirmado:', paymentData);
      onConfirm(paymentData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="calculadora-overlay">
      <div className="calculadora-modal">
        <div className="calculadora-header">
          <h2>Calculadora de Cambio</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="calculadora-content">
          <div className="total-section">
            <p className="total-label">Total a pagar:</p>
            <p className="total-amount">{formatCurrency(totalAmount)}</p>
          </div>

          <div className="input-section">
            <label htmlFor="dinero-entregado">Dinero entregado:</label>
            <input
              id="dinero-entregado"
              type="text"
              value={dineroEntregado}
              onChange={handleInputChange}
              placeholder="Ingrese el monto"
              className="dinero-input"
            />
          </div>

          <div className="billetes-section">
            <p className="billetes-label">Billetes predeterminados:</p>
            <div className="billetes-grid">
              {billetes.map((billete) => (
                <button
                  key={billete}
                  className="billete-button"
                  onClick={() => handleBilleteClick(billete)}
                >
                  {formatCurrency(billete)}
                </button>
              ))}
              <button
                className="billete-button completo-button"
                onClick={handleCompletoClick}
              >
                Completo
              </button>
            </div>
          </div>

          {dineroEntregado && (
            <div className="cambio-section">
              <p className="cambio-label">Total a devolver:</p>
              <p className={`cambio-amount ${cambio < 0 ? 'insuficiente' : ''}`}>
                {cambio < 0 ? 'Dinero insuficiente' : formatCurrency(cambio)}
              </p>
            </div>
          )}
        </div>

        <div className="calculadora-footer">
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="btn-confirmar"
            onClick={handleConfirmar}
            disabled={!dineroEntregado || parseFloat(dineroEntregado) < totalAmount}
          >
            Confirmar Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculadoraCambio;