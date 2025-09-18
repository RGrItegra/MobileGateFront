import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser } from '../../services/authService';
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
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Efecto para redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/welcome';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

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
      // Llamar al servicio de autenticación
      const response = await loginUser(username, password);
      
      if (response.success && response.user) {
        // Actualizar el contexto de autenticación
        login(response.user);
        
        // Éxito
        showModal('success', 'Inicio de sesión exitoso. Redirigiendo...');
        
        // Determinar la ruta de destino
        const from = location.state?.from?.pathname || '/welcome';
        
        // Navegar después de mostrar éxito
        setTimeout(() => {
          closeModal();
          navigate(from, { replace: true });
        }, 2000);
      } else {
        // Error en la respuesta
        showModal('error', 'Error en la autenticación');
      }
    } catch (error) {
      // Error del sistema o credenciales incorrectas
      showModal('error', error.message || 'Error del sistema. Intente nuevamente');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Manejador para cerrar modal manualmente
  const handleModalClose = () => {
    closeModal();
    // Si es éxito y el usuario cierra manualmente, navegar igual
    if (modal.type === 'success') {
      const from = location.state?.from?.pathname || '/welcome';
      navigate(from, { replace: true });
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