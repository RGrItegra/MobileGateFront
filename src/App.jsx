import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Importación de componentes principales
import Login from './components/Login/Login'
import Welcome from './components/Welcome/Welcome'
import Loading from './components/Loading/Loading'

// Importación del contexto de loading
import { LoadingProvider, useLoading } from './contexts/LoadingContext'

// Importación del servicio de autenticación para el UUID
import { getUserUUID } from './services/authService'

// Nota: Los demás componentes se implementarán en futuras iteraciones
// import Consulta from './components/Consulta/Consulta'
import ValorAPagar from './components/ValorAPagar/ValorAPagar'
// import Settings from './components/Settings/Settings'

// Componente interno que usa el contexto de loading
function AppContent() {
  const { isLoading } = useLoading();

  // Efecto para generar el UUID al cargar la aplicación
  useEffect(() => {
    // Obtener o generar el UUID del usuario
    const uuid = getUserUUID();
    // Activar para obtener el UUID
    console.log('UUID del usuario:', uuid);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/welcome" element={<Welcome />} />
            {/* Las siguientes rutas se implementarán en futuras iteraciones */}
            {/* <Route path="/consulta" element={<Consulta />} /> */}
            <Route path="/valor-a-pagar" element={<ValorAPagar />} />
            {/* <Route path="/settings" element={<Settings />} /> */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}

export default App