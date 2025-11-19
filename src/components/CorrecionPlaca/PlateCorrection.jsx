import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import '../../styles/Welcome/Welcome.css';
import '../../styles/CorrecionPlaca/PlateCorrection.css'

const PlateCorrection = () => {
    const [placa, setPlaca] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [selectedSalida, setSelectedSalida] = useState(null);
    const [salidas, setSalidas] = useState([]);
    const [loading, setLoading] = useState(false);

    // Cargar salidas al montar el componente
    useEffect(() => {
        fetchSalidas();
    }, []);

    const fetchSalidas = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/antenna/salidas');
            const result = await response.json();
            
            if (response.ok && result.data) {
                // Si la API devuelve un solo objeto, conviértelo en array
                const salidasArray = Array.isArray(result.data) ? result.data : [result.data];
                setSalidas(salidasArray);
            }
        } catch (err) {
            console.error('Error fetching salidas:', err);
        } finally {
            setLoading(false);
        }
    };

    const validatePlaca = (value) => {
        const regex = /^[A-Za-z0-9]{6}$/;
        return regex.test(value);
    };

    const handlePlacaChange = (e) => {
        let value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        setPlaca(value);
        setIsValid(validatePlaca(value));
    };

    const handleProcesar = async () => {
        if (!isValid || !selectedSalida) return;

        try {
            setLoading(true);

            const response = await fetch('http://localhost:3000/correct/plate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    gerId: selectedSalida,
                    cor_plate: placa
                })
            });

            const result = await response.json();

            if (response.ok) {
                // Limpiar formulario después del éxito
                setPlaca('');
                setIsValid(false);
                setSelectedSalida(null);
            }
        } catch (err) {
            console.error('Error processing correction:', err);
        } finally {
            setLoading(false);
        }
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
                    {salidas.map((salida) => (
                        <label key={salida.gerNr} className="salida-option">
                            <input
                                type="checkbox"
                                checked={selectedSalida === salida.gerNr}
                                onChange={() => setSelectedSalida(salida.gerNr)}
                            />
                            {salida.antName}
                        </label>
                    ))}
                </div>
            </div>

            {/* Botón (mismo ancho que el input) */}
            <div className="search-container">
                <button
                    className="plate-continue-button"
                    disabled={!isValid || !selectedSalida || loading}
                    onClick={handleProcesar}
                >
                    {loading ? 'PROCESANDO...' : 'PROCESAR'}
                </button>
            </div>
        </div>
    );
};


export default PlateCorrection;