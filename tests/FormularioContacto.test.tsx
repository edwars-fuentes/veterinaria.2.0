
 // @vitest-environment jsdom
import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FormularioContacto from "../src/componentes/organismos/FormularioContacto";

test("muestra una alerta cuando el nombre está vacío", () => {
  const alerta = vi.spyOn(window, "alert").mockImplementation(() => {});

  render(<FormularioContacto />);

  fireEvent.click(
    screen.getByRole("button", { name: /Enviar mensaje/i })
  );

  expect(alerta).toHaveBeenCalledWith("Debe ingresar su nombre");

  alerta.mockRestore();
});
