// @vitest-environment jsdom
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Boton from "../src/componentes/atomos/Boton";

test("el botón muestra el texto Ver detalle", () => {
    render(
        <MemoryRouter>
            <Boton id={3} />
        </MemoryRouter>
    );

    const boton = screen.getByText("Ver detalle");

    expect(boton.textContent).toBe("Ver detalle");

});