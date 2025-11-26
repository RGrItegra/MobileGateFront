
const API_URL = process.env.API_URL|| 'http://localhost:3000';

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

        const user = JSON.parse(sessionStorage.getItem("user"));

        if (!tipoMapped || !numDcto) throw new Error("Tipo y número de documento son requeridos");

        const response = await fetch(
            `${API_URL}/ticket/client/find?tipoDcto=${tipoMapped}&nroDcto=${numDcto}`,
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
        );

        const data = await response.json();
        return {
            status: response.status,
            data: data
        };
    } catch (error) {
        console.error("Error en buscarCliente:", error.message);
        throw error;
    }
}