import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HiMenu } from 'react-icons/hi';
import { AiOutlineHome, AiOutlineSetting, AiOutlineLogout } from 'react-icons/ai';
import '../../styles/Header/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleHome = () => {
    navigate('/welcome');
    setIsMenuOpen(false);
  };

  const closePath = process.env.API_URL || 'http://localhost:3000';

  const handleLogout = async () => {
    setIsMenuOpen(false);

    try {
      const stored = sessionStorage.getItem("user");
      const parsed = stored ? JSON.parse(stored) : null;
      const sesId = parsed?.session?.sesId;
      const token = parsed?.token;

      if (sesId) {
        const response = await fetch(`${closePath}/session/sessions/${sesId}/close`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error cerrando sesión en backend", errorData);
        } else {
          // console.log("Sesión cerrada correctamente en backend");
        }
      }

    } catch (error) {
      console.error("Error en la petición de cierre de sesión:", error);
    } finally {
      // Limpiar sessionStorage y actualizar estado global
      sessionStorage.removeItem("user");
      logout();
      navigate("/login");
    }
  };

  const handleSettings = () => setIsMenuOpen(false);

  return (
    <>
      <header className={`header ${isMenuOpen ? 'menu-open' : ''}`}>
        <button className="hamburger-btn" onClick={toggleMenu}>
          <HiMenu size={24} />
        </button>
        <img src="/Logo-Los-Molinos.webp" alt="logo" className="logo" />
        <div className="header-text">
          <h2 className="subheading">MOBILE</h2>
          <h1 className="mainheading">PAYMENT</h1>
        </div>
      </header>

      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

      <div className={`sidebar-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <img src="/Logo-Los-Molinos.webp" alt="Los Molinos" className="menu-logo" />
        </div>
        <nav className="menu-nav">
          <button className="menu-item" onClick={handleHome}>
            <AiOutlineHome size={20} /><span>Home</span>
          </button>
          <button className="menu-item" onClick={handleSettings}>
            <AiOutlineSetting size={20} /><span>Settings</span>
          </button>
          <button className="menu-item" onClick={handleLogout}>
            <AiOutlineLogout size={20} /><span>Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Header;
