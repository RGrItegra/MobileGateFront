// src/components/general/Loading.js
import React from 'react';
import '../../styles/Loading/Loading.css'; 

const Loading = () => {
  return (
    <div className="loading-container">
      <span className="loader"></span>
      <div className="loading-text">
        <span className="loading-text-animation">Cargando</span>
        <span className="loading-text-animation">...</span>
      </div>
    </div>
  );
};

export default Loading;