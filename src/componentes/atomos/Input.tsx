type Props = {
    tipo: string;
    nombre: string;
    valor?: string;
    placeholder?: string;
    alCambiar?: (valor: string) => void;
};

function Input({ tipo, nombre, valor, placeholder, alCambiar }: Props) {
    return (
        <input
            type={tipo}
            name={nombre}
            className="form-control"
            value={valor}
            placeholder={placeholder}
            onChange={(e) => alCambiar && alCambiar(e.target.value)}
        />
    );
}

export default Input;