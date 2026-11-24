import Input from "../atomos/Input";

type Props = {
    estiqueta: string;
    tipo: string;
    nombre: string;
    valor: string;
    alCambiar: (valor: string) => void;
};

function CampoRegistro({estiqueta,tipo,nombre,valor,alCambiar}:Props){
    return (
        <div>
            <label className="form-label">
                {estiqueta}
            </label>

            <Input 
            tipo={tipo} 
            nombre={nombre}
            valor={valor}
            alCambiar={alCambiar}/>
        </div>
    )
}

export default CampoRegistro;
