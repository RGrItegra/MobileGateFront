import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';
import { AiOutlineHome, AiOutlineSetting, AiOutlineLogout } from 'react-icons/ai';
import '../../styles/Header/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleHome = () => {
    navigate('/welcome');
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleSettings = () => {
    // Funcionalidad pendiente
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`header ${isMenuOpen ? 'menu-open' : ''}`}>
        <button className="hamburger-btn" onClick={toggleMenu}>
        <HiMenu size={24} />
      </button>
        <img src="/Logo-Los-Molinos.webp" alt="logocc" className="logo" />
        <div className="header-text">
          <h2 className="subheading">MOBILE</h2>
          <h1 className="mainheading">PAYMENT</h1>
        </div>
      </header>

      {/* Overlay */}
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

      {/* Sidebar Menu */}
      <div className={`sidebar-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <img src="/Logo-Los-Molinos.webp" alt="Los Molinos" className="menu-logo" />
        </div>
        <nav className="menu-nav">
          <button className="menu-item" onClick={handleHome}>
            <AiOutlineHome size={20} />
            <span>Home</span>
          </button>
          <button className="menu-item" onClick={handleSettings}>
            <AiOutlineSetting size={20} />
            <span>Settings</span>
          </button>
          <button className="menu-item" onClick={handleLogout}>
            <AiOutlineLogout size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Header;