import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserDataModal from '../modals/UserDataModal/UserDataModal';
import '../../styles/Login/Login.css';

const Login = () => {
  // Estados simplificados
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState({
    isOpen: false,
    type: '',
    message: ''
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const navigate = useNavigate();

  // Función para mostrar modal
  const showModal = (type, message) => {
    setModal({ isOpen: true, type, message });
  };

  // Función para cerrar modal
  const closeModal = () => {
    setModal({ isOpen: false, type: '', message: '' });
  };

  // Manejador del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!username.trim() || !password.trim()) {
      showModal('error', 'Por favor ingrese usuario y contraseña');
      return;
    }
    
    // Iniciar proceso de autenticación
    setIsAuthenticating(true);
    showModal('loading', 'Validando credenciales...');
    
    try {
      // Simular tiempo de validación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validar credenciales
      if (username === 'admin123' && password === 'admin123') {
        // Éxito
        showModal('success', 'Inicio de sesión exitoso. Redirigiendo...');
        
        // Navegar después de mostrar éxito
        setTimeout(() => {
          closeModal();
          navigate('/welcome');
        }, 2000);
      } else {
        // Error de credenciales
        showModal('error', 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      // Error del sistema
      showModal('error', 'Error del sistema. Intente nuevamente');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Manejador para cerrar modal manualmente
  const handleModalClose = () => {
    closeModal();
    // Si es éxito y el usuario cierra manualmente, navegar igual
    if (modal.type === 'success') {
      navigate('/welcome');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-logo">
          <img src="/Logo-Los-Molinos.webp" alt="Logo de la aplicación" id="logo" />
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su usuario"
              className="form-control"
              disabled={isAuthenticating}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              className="form-control"
              disabled={isAuthenticating}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-btn"
            disabled={isAuthenticating}
          >
            {isAuthenticating ? 'Validando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
      
      <UserDataModal
        isOpen={modal.isOpen}
        type={modal.type}
        message={modal.message}
        onClose={handleModalClose}
        showLoading={modal.type === 'loading'}
      />
    </div>
  );
};

export default Login;