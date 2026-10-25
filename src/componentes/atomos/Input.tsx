type Props = {
    tipo: string;
    nombre: string;
<<<<<<< HEAD
    valor?: string;
    placeholder?: string;
    alCambiar?: (valor: string) => void;
=======
    valor: string;
    placeholder: string;
    alCambiar: (valor: string) => void;
>>>>>>> 8e2bc1117fc00d867bdaa4fb862838fbae15d60d
};

function Input({ tipo, nombre, valor, placeholder, alCambiar }: Props) {
    return (
        <input
            type={tipo}
            name={nombre}
            className="form-control"
            value={valor}
            placeholder={placeholder}
<<<<<<< HEAD
            onChange={(e) => alCambiar && alCambiar(e.target.value)}
=======
            onChange={(e) => alCambiar(e.target.value)}
>>>>>>> 8e2bc1117fc00d867bdaa4fb862838fbae15d60d
        />
    );
}

export default Input;