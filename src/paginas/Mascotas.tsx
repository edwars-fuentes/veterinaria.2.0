import CardMascotas from "../componentes/moleculas/CardMascotas";

function Mascotas(){
    return(
        <div>
            <h1>Adopcion</h1>
            <div className="d-flex gap-3">
            <CardMascotas
            id={1}
            titulo="golden"
            descripcion="perro amigable"
            precio={20000}
            imagen="/img/golde.jpg"
            />
            <br />
            <CardMascotas
            id={2}
            titulo="aleman"
            descripcion="perro guardian"
            precio={24000}
            imagen="/img/aleman.jpg"
            />
            <br />
            <CardMascotas
            id={3}
            titulo="American Shorthair"
            descripcion="gato pequeño"
            precio={19000}
            imagen="/img/American Shorthair.jpg"
            />
            <br />
            <CardMascotas
            id={4}
            titulo="pug"
            descripcion="perro lindo"
            precio={18000}
            imagen="/img/pug.jpg"
            />
            <br />
            <CardMascotas
            id={5}
            titulo="ragdoll"
            descripcion="gato peludo"
            precio={24000}
            imagen="/img/ragdoll.jpg"
            />

            </div>
        </div>
    )
}
export default Mascotas;