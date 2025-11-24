import React, { useState, useEffect, useRef } from 'react';
import Header from '../Header/Header';
import CoincidenciasModal from '../modals/CoincidenciaModal/CoincidenciaModal';
//import coincidenciasMock from '../test/test.json'

import '../../styles/modals/CoincidenciaModal/CoincidenciaModal.css'
import '../../styles/Welcome/Welcome.css';
import '../../styles/CorrecionPlaca/PlateCorrection.css'

const PlateCorrection = () => {
    const [placa, setPlaca] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [selectedSalida, setSelectedSalida] = useState(null);
    const [salidas, setSalidas] = useState([]);
    const [loading, setLoading] = useState(false);

    const [coincidencias, setCoincidencias] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [mensajeExito, setMensajeExito] = useState("");

    const apiPath = process.env.API_URL || 'http://localhost:3000';
    const apiPlatePath = process.env.API_PLATE_URL || 'http://localhost:3000';

    useEffect(() => {
        if (mensajeExito) {
            const timer = setTimeout(() => {
                setMensajeExito("");
            }, 1400);

            return () => clearTimeout(timer);
        }
    }, [mensajeExito]);

    const hasFetched = useRef(false);

    // Cargar salidas al montar el componente
    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchSalidas();
        }
    }, []);


    const fetchSalidas = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiPath}/antenna/salidas`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                }
            });
            const result = await response.json();

            if (response.status === 401 || response.status === 403) {
                sessionStorage.clear();
                navigate("/login");
                return
            }

            if (response.ok && result.data) {
                // Si la API devuelve un solo objeto, conviértelo en array
                const salidasArray = Array.isArray(result.data) ? result.data : [result.data];
                setSalidas(salidasArray);
            }
        } catch (error) {
            console.error('Error fetching salidas:', error);
            sessionStorage.clear();
            navigate("/login");
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

        const valida = validatePlaca(value);
        setIsValid(valida);

        if (valida) {
            consultarCoincidencia(value);
        }
    };


    const consultarCoincidencia = async (placaIngresada) => {
        setLoading(true);
        try {
            const response = await fetch(
                `${apiPlatePath}/api/plates/coincidence/${placaIngresada}`,
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`
                    }
                }
            );

            if (response.status === 401 || response.status === 403) {
                sessionStorage.clear();
                navigate("/login");
                return;
            }

            let result = await response.json();

            if (response.ok && Array.isArray(result) && result.length > 0) {
                if (result.length > 3)
                    result = result.slice(0, 3);
                setCoincidencias(result);
                setShowModal(true);
            } else {
                setCoincidencias([]);
                setShowModal(false);
            }

        } catch (err) {
            console.error("Error al consultar coincidencias:", err);
            setCoincidencias([]);
            setShowModal(false);
        } finally {
            setLoading(false);
        }
    };

    /*const consultarCoincidencia = () => {

        // Acceso correcto a tu estructura JSON
        const mock = Array.isArray(coincidenciasMock) ? coincidenciasMock : [];

        const coincidenciasFiltradas = mock.filter(item => item.distance <= 1);

        if (coincidenciasFiltradas.length  > 0) {
            setCoincidencias(coincidenciasFiltradas);
            setShowModal(true);
        } else {
            setCoincidencias([]);
            setShowModal(false);
        }
    };*/


    const handleSelectCoincidencia = (plate) => {
        setPlaca(plate);
        setShowModal(false);
    };

    const handleProcesar = async () => {
        if (!isValid || !selectedSalida) return;

        try {
            setLoading(true);

            const response = await fetch(`${apiPath}/correct/plate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    gerId: selectedSalida,
                    cor_plate: placa
                })
            });

            if (response.status === 401 || response.status === 403) {
                sessionStorage.clear()
                navigate("/login");
                return;
            }

            const result = await response.json();

            if (response.ok) {
                setPlaca('');
                setIsValid(false);
                setSelectedSalida(null);
                setMensajeExito("✔ Corrección realizada exitosamente");
            }

        } catch (err) {
            console.error('Error processing correction:', err);
            navigate("/login");
            return;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">
            <Header />

            {/*
            <div className="img-container">
                <img src="/Recurso 1.png" alt="Imagen Portada" />
            </div>

            <div className="text-p-container">
                <p>
                    Inicie el Proceso de <br /> <b>corrección de placa</b><br />
                    ingresando número de placa
                </p>
            </div>
            */}

            {mensajeExito && (
                <div className="mensaje-exito">
                    {mensajeExito}
                </div>
            )}

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

            {/* Selección de salida */}
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

            {/* Botón */}
            <div className="search-container">
                <button
                    className="plate-continue-button"
                    disabled={!isValid || !selectedSalida || loading}
                    onClick={handleProcesar}
                >
                    {loading ? 'PROCESANDO...' : 'PROCESAR'}
                </button>
            </div>

            {/* Modal coincidencias */}
            {showModal && (
                <CoincidenciasModal
                    coincidencias={coincidencias}
                    onSelect={handleSelectCoincidencia}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};


export default PlateCorrection;