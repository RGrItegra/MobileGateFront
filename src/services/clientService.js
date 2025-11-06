
const API_URL = "http://localhost:3000/ticket";

const tipoDocumentoMap = {
    "CÉDULA DE CIUDADANÍA": "CC",
    "CÉDULA EXTRANJERÍA": "CE",
    "PERMISO PROTECCIÓN TEMPORAL": "PPT",
    "PASAPORTE": "PA",
    "NIT": "NIT"
}

export async function buscarCliente(tipoDcto, nroDcto) {
    try {
        const tipoMapped = tipoDocumentoMap[tipoDcto] || tipoDcto;
        const numDcto = nroDcto.trim();

        if (!tipoMapped || !numDcto) throw new Error("Tipo y número de documento son requeridos");

        const response = await fetch(
            `${API_URL}/client/find?tipoDcto=${tipoMapped}&nroDcto=${numDcto}`
        );

        if (!response.ok) throw new Error("Error al buscar el cliente");

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en buscarCliente:", error.message);
        throw error;
    }
}