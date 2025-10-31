// authService.js (ajustado)
const API_URL = process.env.API_URL || 'http://localhost:3000';

const generateUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });

export const getUserUUID = () => {
  let uuid = localStorage.getItem('userUUID');
  if (!uuid) {
    uuid = generateUUID();
    localStorage.setItem('userUUID', uuid);
  }
  return uuid;
};

export const loginUser = async (username, password) => {
  try {
    const deviceUuid = getUserUUID();
    const loginData = { usr_name: username, usr_passwd: password, devUuid: deviceUuid };

    // Primero login interno
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({ message: "Error de conexión" }));
      throw new Error(errBody.message || `Error ${response.status}`);
    }

    const userData = await response.json();

    // Luego login externo
    /*let externalData = null;
    try {
      const authResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ devUuid: deviceUuid }),
      });
      if (authResponse.ok) externalData = await authResponse.json();
    } catch (e) {
      console.warn("No se pudo autenticar en API externa:", e);
    }*/

    // Extraer tokens
    const internalToken = userData?.session?.sesToken || userData?.token || null;
   ///const externalToken = externalData?.token || externalData?.key || null;

    

    if (!internalToken) throw new Error("Login interno fallido: token no recibido");

    const sessionData = {
      token: internalToken,
      session: userData.session || null,
      userInfo: userData.user || userData,
      device: userData.device || null,
      fiscalConfig: userData.fiscalConfig || null,
      //externalToken,
      loggedAt: Date.now(),
    };

    // Guardar en sessionStorage reemplazando cualquier login anterior
    sessionStorage.setItem('user', JSON.stringify(sessionData));

    console.log('[authService] Sesión iniciada:', sessionData);
    return { success: true, user: sessionData };

  } catch (error) {
    if (error instanceof TypeError) throw new Error("Error de red o conexión");
    throw error;
  }
};

export const logoutUser = () => {
  // Limpiar sessionStorage y localStorage (si hay datos como sesId y token)
  sessionStorage.removeItem('user');
  localStorage.removeItem('sesId');
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  const u = getCurrentUser();
  return !!(u && u.token);
};

export const getAuthToken = () => {
  const u = getCurrentUser();
  return u?.token || null;
};
