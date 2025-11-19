import React, { useState } from 'react';
import Header from '../Header/Header';
import '../../styles/Welcome/Welcome.css';
import '../../styles/CorrecionPlaca/PlateCorrection.css'

const PlateCorrection = () => {
    const [placa, setPlaca] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [selectedSalida, setSelectedSalida] = useState(null);

    // Mock temporal (solo visual)
    const salidasMock = [
        { id: 1, nombre: "Salida 43" },
        { id: 2, nombre: "Salida 45" },
        { id: 3, nombre: "Salida 47" },
        { id: 4, nombre: "Salida 32" },
        { id: 5, nombre: "Salida 55" },
        { id: 6, nombre: "Salida 57" },
    ];

    const validatePlaca = (value) => {
        const regex = /^[A-Za-z0-9]{6}$/;
        return regex.test(value);
    };

    const handlePlacaChange = (e) => {
        let value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        setPlaca(value);
        setIsValid(validatePlaca(value));
    };

  
    return (
        <div className="home-container">
            <Header />

            <div className="img-container">
                <img src="/Recurso 1.png" alt="Imagen Portada" />
            </div>

            <div className="text-p-container">
                <p>
                    Inicie el Proceso de <br /> <b>corrección de placa</b><br />
                    ingresando número de placa
                </p>
            </div>

            {/* Input placa */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Ingrese su placa"
                    maxLength={6}
                    className="search-input"
                    value={placa}
                    onChange={handlePlacaChange}
                />
            </div>

            {/* Selección de salida en el centro */}
            <div className="salidas-container">
                <p className="salidas-title">Seleccione la salida</p>

                <div className="salidas-grid">
                    {salidasMock.map((salida) => (
                        <label key={salida.id} className="salida-option">
                            <input
                                type="checkbox"
                                checked={selectedSalida === salida.id}
                                onChange={() => setSelectedSalida(salida.id)}
                            />
                            {salida.nombre}
                        </label>
                    ))}
                </div>
            </div>

            {/* Botón (mismo ancho que el input) */}
            <div className="search-container">
                <button
                    className="plate-continue-button"
                    disabled={!isValid || !selectedSalida}
                >
                    PROCESAR
                </button>
            </div>
        </div>
    );
};


export default PlateCorrection;