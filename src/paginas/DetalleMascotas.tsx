import { useParams } from "react-router-dom";

const Mascotas = [
    {
        id: 1,
        titulo:"golden",
        descripcion:"El Golden Retriever es un perro de tamaño mediano-grande originario de Escocia, famoso por su carácter equilibrado, inteligencia y gran apego a la familia",
        precio: 20000,
        imagen:"/img/golde.jpg",
    },
    {
        id:2,
        titulo:"El Pastor Alemán (u ovejero alemán) es un perro grande, ágil, musculoso y de gran inteligencia.",
        descripcion:"perro guardian",
        precio:24000,
        imagen:"/img/aleman.jpg",
    },
    {
        id:3,
        titulo:"American Shorthair",
        descripcion:"felino de tamaño mediano a grande, musculoso y de gran fortaleza, famoso por su carácter equilibrado, amable y dócil",
        precio:19000,
        imagen:"/img/esmoquin.jpg"        
    },
    {
        id:4,
        titulo:"pug",
        descripcion:"son animales de talla pequeña, afectuosos y de gran personalidad",
        precio:18000,
        imagen:"/img/pug.jpg"
    },
    {
        id:5,
        titulo:"ragdoll",
        descripcion:"es una raza grande, de complexión musculosa y pelo semilargo, famoso por su carácter dócil, afectuoso y su tendencia a relajarse por completo",
        precio:24000,
        imagen:"/img/ragdoll.jpg",
    }
]

function DetalleMascotas(){
    const {id} = useParams()

    const Mascota = Mascotas.find(
        Mascota => Mascota.id === Number(id)
    )
    return(
        <div>
            <h1>Detalle de las macotas</h1>

            <img 
            src={Mascota?.imagen} 
            alt={Mascota?.titulo} 
            style={{ width: '300px'}}
            />

            <h2>{Mascota?.titulo}</h2>

            <p>{Mascota?.descripcion}</p>

            <p>${Mascota?.precio}</p>

        </div>
    )
}

export default DetalleMascotas;