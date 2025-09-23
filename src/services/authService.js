// Servicio para manejar la autenticación de usuarios
// Este archivo contiene funciones para iniciar sesión, cerrar sesión y verificar el estado de autenticación

// URL base para las peticiones de autenticación
// En un entorno real, esto vendría de variables de entorno o configuración
const API_URL = localStorage.getItem('serverUrl') || 'http://localhost:3000';

/**
 * Función para generar un UUID v4
 * @returns {string} - UUID generado
 */
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Función para obtener el UUID del usuario actual o generar uno nuevo
 * @returns {string} - UUID del usuario
 */
export const getUserUUID = () => {
  let uuid = localStorage.getItem('userUUID');
  
  if (!uuid) {
    uuid = generateUUID();
    localStorage.setItem('userUUID', uuid);
  }
  
  return uuid;
};

// Verificamos si hay un UUID al cargar la aplicación
getUserUUID();

/**
 * Función para iniciar sesión
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise} - Promesa con la respuesta del servidor
 */export const loginUser = async (username, password) => {
  try {
    const deviceUuid = getUserUUID();

    //  Login interno
    const loginData = { usr_name: username, usr_passwd: password, devUuid: deviceUuid };

    const [response, AuthResponse] = await Promise.all([
      fetch(`${API_URL}/users/login`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      }),

      fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ devUuid: deviceUuid }),
      })
    ]) 
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Error de conexión" }));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    if (!AuthResponse.ok) {
      throw new Error("Error autenticando en API externa");
    }

    const [userData,externalData] = await Promise.all([response.json(), AuthResponse.json()]);

    // 3. Guardar todo junto
    const sessionData = {
      ...userData,
      external: externalData, 
    };

    localStorage.setItem("user", JSON.stringify(sessionData));

    return { success: true, user: sessionData };
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Error de conexión. Verifique su conexión a internet.");
    }
    throw error;
  }
};

/**
 * Función para cerrar sesión
 */
export const logoutUser = () => {
  localStorage.removeItem('user');
};

/**
 * Función para obtener el usuario actual
 * @returns {Object|null} - Datos del usuario o null si no hay sesión
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};

/**
 * Función para verificar si el usuario está autenticado
 * @returns {boolean} - true si está autenticado, false en caso contrario
 */
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};