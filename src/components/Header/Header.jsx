import React from 'react';
import '../../styles/Header/Header.css';

const Header = () => {
  return (
    <header className="header">
      <img src="/Logo-Los-Molinos.webp" alt="logocc" className="logo" />
      <div className="header-text">
        <h2 className="subheading">MOBILE</h2>
        <h1 className="mainheading">PAYMENT</h1>
      </div>
    </header>
  );
};

export default Header;