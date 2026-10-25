import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './componentes/organismos/Navbar'
import Mascotas from './paginas/Mascotas'
import Inicio from './paginas/Inicio'
import DetalleMascotas from './paginas/DetalleMascotas'
import Contacto from './paginas/Contacto'
import Registro from './paginas/Registro'
import InicioUsuario from './paginas/InicioUsuario'
import CuentaUsuario from './paginas/CuentaUsuario'

function App() {
  return(
    <>
      <Navbar/>
      <Routes>
        <Route
          path="/"
          element={<Inicio/>}
        />
        <Route
          path="/InicioUsuario"
          element={<InicioUsuario />}
        />
        <Route
          path="/CuentaUsuario"
          element={<CuentaUsuario/>}
        />
        <Route
          path="/Mascotas"
          element={<Mascotas/>}
        />
        <Route
          path="/Mascotas/:id"
          element={<DetalleMascotas/>}
        />
          <Route
          path="/Contacto"
          element={<Contacto/>}
        />
          <Route
          path="/Registro"
          element={<Registro/>}
        />
      </Routes>   
    </>
  ) 
}

export default App