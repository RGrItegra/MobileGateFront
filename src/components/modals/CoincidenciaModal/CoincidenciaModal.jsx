import React from "react";
import '../../../styles/modals/CoincidenciaModal/CoincidenciaModal.css'



const CoincidenciasModal = ({ coincidencias, onSelect, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                
                <h2 className="modal-title">Coincidencias encontradas</h2>

                <div className="modal-grid">
                    {coincidencias.length > 0 ? (
                        coincidencias.map((item, i) => (
                            <div
                                key={i}
                                className="modal-card"
                                onClick={() => onSelect(item.plate)}
                            >
                                {/* Imagen */}
                                {item.img ? (
                                    <img
                                        src={`data:image/jpeg;base64,${item.img}`}
                                        alt={item.plate}
                                        className="modal-img"
                                    />
                                ) : (
                                    <div className="modal-img placeholder">
                                        Imagen no disponible
                                    </div>
                                )}

                                {/* Placa */}
                                <p className="modal-plate">{item.plate}</p>
                            </div>
                        ))
                    ) : (
                        <p className="modal-no-results">No se encontraron coincidencias.</p>
                    )}
                </div>

                <button className="modal-close-button" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default CoincidenciasModal;