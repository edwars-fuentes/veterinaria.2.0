import Input from "../atomos/Input";

type Props = {
    etiqueta: string;
    tipo: string;
    nombre: string;
    valor: string;
    placeholder: string;
    alCambiar: (valor: string) => void;
};

function CampoFormulario({ etiqueta, tipo, nombre, valor, placeholder, alCambiar }: Props) {
    return (
        <div className="mb-3 text-center">
            <label htmlFor={nombre} className="form-label fw-normal">
                {etiqueta}
            </label>

            <Input 
                tipo={tipo} 
                nombre={nombre}
                valor={valor}
                placeholder={placeholder}
                alCambiar={alCambiar}
            />
        </div>
    );
}

export default CampoFormulario;