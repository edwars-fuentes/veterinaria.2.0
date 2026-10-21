import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './componentes/organismos/Navbar'
import Mascotas from './paginas/Mascotas'
import Inicio from './paginas/Inicio'
import DetalleMascotas from './paginas/DetalleMascotas'
import Contacto from './paginas/Contacto'

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
      </Routes>   
    </>
  ) 
}

export default App