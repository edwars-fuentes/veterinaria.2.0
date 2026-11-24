import { Link } from "react-router-dom";

interface BotonProps {
    id: number;
}

function Boton({id}: BotonProps){

    return (
        <Link 
        to={`/Mascotas/${id}`}
        className="btn btn-success">
            Ver detalle
        </Link>
    );
}

export default Boton;