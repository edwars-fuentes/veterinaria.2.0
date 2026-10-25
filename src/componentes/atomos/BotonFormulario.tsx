interface Props {
    texto: string;
}

function BotonFormulario({ texto }: Props) {
    return (
        <button
            type="submit"
            className="btn btn-primary w-100"
        >
            {texto}
        </button>
    );
}

export default BotonFormulario;
