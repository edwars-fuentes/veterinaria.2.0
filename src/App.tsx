import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './componentes/organismos/Navbar'
import Mascotas from './paginas/Mascotas'
import Inicio from './paginas/Inicio'
import Contacto from './paginas/Contacto'
import Registro from './paginas/Registro'
import InicioUsuario from './paginas/InicioUsuario'
import CuentaUsuario from './paginas/CuentaUsuario'
import Login from './paginas/Login'
import PanelOficinista from './componentes/organismos/PanelOficinista'
import PanelAdmin from './componentes/organismos/PanelAdmin'
import Carrito from './paginas/Carrito'
import ProductoMascota from './paginas/ProductoMascota'

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
          path="/Tienda" 
          element={<ProductoMascota/>} 
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
          path="/Contacto"
          element={<Contacto/>}
        />
          <Route
          path="/Registro"
          element={<Registro/>}
        />
          <Route
          path="/Login"
          element={<Login/>}
        />
          <Route
          path="/PanelOficinista"
          element={<PanelOficinista/>}
        />
          <Route
          path="/PanelAdmin"
          element={<PanelAdmin/>}
        />
          <Route
          path="/Carrito"
          element={<Carrito/>}
        />
      </Routes>   
    </>
  ) 
}

export default App