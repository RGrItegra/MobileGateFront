import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Loading from '../Loading/Loading';
import FacturaElectronicaModal from '../modals/FacturaElectronicaModal/FacturaElectronicaModal';
import PrintComprobanteModal from '../modals/PrintComprobanteModal/PrintComprobanteModal';
import CalculadoraCambio from '../modals/CalculadoraCambio/CalculadoraCambio';
import { confirmarPago } from '../../services/ticketService';
import '../../styles/ConfirmacionPago/ConfirmacionPago.css';

const ConfirmacionPago = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showFacturaModal, setShowFacturaModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showCalculadoraModal, setShowCalculadoraModal] = useState(false);
  
  //obtenemos los datos  que vienen de valor a pagar
  const confirmationData = location.state?.paymentData;
  // console.log("confirmationData:", confirmationData);
  // Monitorear cambios en showPrintModal
  useEffect(() => {
    if(!confirmationData){
      navigate('/welcome');
    }
  }, [confirmationData]);
  
  const handleConfirmarPago = () => {
    setShowCalculadoraModal(true);
  };

  // Función para manejar el cierre del modal de factura electrónica
  const handleFacturaClose = () => {
    setShowFacturaModal(false);
    navigate('/welcome');
  };

  // Función para continuar después del modal de factura electrónica
  const handleFacturaContinue = () => {
    // console.log('handleFacturaContinue called');
    setShowFacturaModal(false);
    setLoading(true);
    
    // Simular procesamiento de pago
    setTimeout(() => {
      // console.log('Payment processing completed');
      setLoading(false);
      setPaymentSuccess(true);
      
      // Mostrar modal de impresión después del pago exitoso
      setTimeout(() => {
        // console.log('Setting showPrintModal to true');
        setShowPrintModal(true);
      }, 2000);
    }, 3000);
  };

  // Función para manejar "Sí" en el modal de impresión
  const handlePrintYes = () => {
    var isAndroid = false;
    try{
        isAndroid = Android.isWebAppClient();
    }catch(e){}

    if(isAndroid){
      const invoce = sessionStorage.getItem("lastInvoice");
      Android.print(invoce);
    }

    // console.log('Usuario eligió imprimir factura');
    setShowPrintModal(false);
    setTimeout(() => {
      navigate('/welcome');
    }, 500);
  };

  // Función para manejar "No" en el modal de impresión
  const handlePrintNo = () => {
    // console.log('Usuario eligió no imprimir factura');
    setShowPrintModal(false);
    setTimeout(() => {
      navigate('/welcome');
    }, 500);
  };

  const handleCalcular = () => {
    setShowCalculadoraModal(true);
  };

  const handleCalculadoraClose = () => {
    setShowCalculadoraModal(false);
  };

  const handleCalculadoraConfirm = async (paymentData) => {
    // console.log('Iniciando procesamiento de pago:', paymentData);
    setShowCalculadoraModal(false);
    setLoading(true);

    try {
      /*const result = await confirmarPago(
        confirmationData.ticket,   // o confirmationData.placa según tu estructura
        'LP',                     // tipo de pago, ajusta si es dinámico
        Number(paymentData.amount),        // monto ingresado desde la calculadora
        'COP'
      );*/
      

      const current = {"amount":paymentData.amount,"ticket":confirmationData.ticket,"type":confirmationData.type};
      sessionStorage.setItem("currentPayment",JSON.stringify(current));

      //console.log('Datos devueltos por la API:', result);
      
      setLoading(false);
      setShowFacturaModal(true);
    } catch (error) {
      console.error('Error al confirmar pago:', error);
      setLoading(false);
      alert('Ocurrió un error al procesar el pago. Intenta nuevamente.');
    }
  };


  if(!confirmationData) return null;

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
        
        {/* Modal de impresión de factura */}
        {/* console.log('Rendering PrintComprobanteModal with showPrintModal:', showPrintModal) */}
        <PrintComprobanteModal 
          isOpen={showPrintModal}
          onAccept={handlePrintYes}
          onCancel={handlePrintNo}
          ticket={confirmationData?.ticket}
          type={confirmationData?.type}
        />
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
          <span>$ {confirmationData.total}</span>
        </div>
        
        <div className="summary-row2">
          <span>Forma de Pago</span>
          <span>Efectivo</span>
        </div>
        
        <div className="summary-row2">
          <span>Fecha:</span>
          <span>{confirmationData.fecha}</span>
        </div>
        
        <div className="summary-row2 total-row">
          <span>Total</span>
          <span>{confirmationData.total}</span>
        </div>
      </div>

      <div className="button-wrapper">
        <button className="btn btn-primary" onClick={handleConfirmarPago}>
          Confirmar y Pagar
        </button>
      </div>



      {/* Modal de facturación electrónica */}
      <FacturaElectronicaModal 
        isOpen={showFacturaModal}
        onClose={handleFacturaClose}
        onContinue={handleFacturaContinue}
      />

      {/* Modal de impresión de factura */}
      {/* console.log('Rendering PrintComprobanteModal with showPrintModal:', showPrintModal) */}
      <PrintComprobanteModal 
        isOpen={showPrintModal}
        onAccept={handlePrintYes}
        onCancel={handlePrintNo}
      />

      {/* Modal de calculadora de cambio */}
      <CalculadoraCambio 
        isOpen={showCalculadoraModal}
        onClose={handleCalculadoraClose}
        onConfirm={handleCalculadoraConfirm}
        totalAmount={confirmationData.total}
      />
    </div>
  );
};

export default ConfirmacionPago;