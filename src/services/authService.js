// authService.js (frontend)
const API_URL = localStorage.getItem('serverUrl') || 'http://localhost:3000';

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

    // Ejecutar en paralelo (tu versión original)
    const [response, authResponse] = await Promise.all([
      fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      }),
      fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ devUuid: deviceUuid }),
      })
    ]);

    // Si el login interno falla: informar y salir (no seguimos)
    if (!response.ok) {
      let errMsg = `Error ${response.status}: ${response.statusText}`;
      try {
        const errBody = await response.json();
        errMsg = errBody.message || errBody.error || JSON.stringify(errBody);
      } catch (e) { /* ignore */ }
      throw new Error(errMsg);
    }

    // Parse responses (no forzar ambos ok)
    const userData = await response.json();
    let externalData = null;
    try {
      externalData = await (authResponse.ok ? authResponse.json() : null);
    } catch (e) {
      console.warn('No se pudo parsear authResponse:', e);
    }

    // ---- Extraer token interno (robusto a varias formas) ----
    const internalToken =
      userData?.token ||
      userData?.data?.token ||
      userData?.session?.sesToken ||
      userData?.accessToken ||
      null;

    if (!internalToken) {
      console.error('Respuesta de /users/login no contiene token interno:', userData);
      throw new Error('Respuesta de login inválida: falta token interno');
    }

    // Extraer token externo si existe (la API externa tiene distintas formas)
    const externalToken =
      externalData?.token ||
      externalData?.token?.key ||
      externalData?.key ||
      externalData?.accessToken ||
      null;

    // Construir objeto de sesión (guardarlo SOLO en sessionStorage)
    const sessionData = {
      token: internalToken,
      session: userData.session || null,
      userInfo: userData.user || userData,
      device: userData.device || null,
      fiscalConfig: userData.fiscalConfig || null,
      externalToken: externalToken || null,
      loggedAt: Date.now()
    };

    // Guardar en sessionStorage (se borra al cerrar pestaña)
    sessionStorage.setItem('user', JSON.stringify(sessionData));

    // Debug: mostrar respuestas en consola para verificar
    console.log('[authService] userData:', userData);
    console.log('[authService] externalData:', externalData);
    console.log('[authService] sessionData guardada en sessionStorage:', sessionData);

    return { success: true, user: sessionData };

  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Error de red o conexión");
    }
    throw error;
  }
};

export const logoutUser = () => {
  sessionStorage.removeItem('user');
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
