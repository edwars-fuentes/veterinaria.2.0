// @vitest-environment jsdom
import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FormularioContacto from "../src/componentes/organismos/FormularioContacto";

test("muestra una alerta cuando el correo está vacío", () => {
  const alerta = vi.spyOn(window, "alert").mockImplementation(() => {});

  const { container } = render(<FormularioContacto />);

  // 1. Escribimos el nombre para pasar la primera validación
  const inputNombre = container.querySelector('input[name="nombre"]')!;
  fireEvent.change(inputNombre, { target: { value: "Edwars" } });

  // 2. Seleccionamos el botón usando getAllByRole para evitar el conflicto de múltiples botones
  const botonEnviar = screen.getAllByRole("button", { name: /Enviar mensaje/i })[0];
  fireEvent.click(botonEnviar);

  // 3. Verificamos la alerta del correo
  expect(alerta).toHaveBeenCalledWith("Debe ingresar su correo");

  alerta.mockRestore();
});