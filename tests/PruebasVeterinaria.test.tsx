// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Boton from "../src/componentes/atomos/Boton";
import FormularioContacto from "../src/componentes/organismos/FormularioContacto";
import FormularioRegistro from "../src/componentes/organismos/FormularioRegistro";
import FormularioLogin from "../src/componentes/organismos/FormularioLogin";

describe("Pruebas veterinarias", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("muestra el texto Ver detalle", () => {
    render(
      <MemoryRouter>
        <Boton id={3} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Ver detalle")).toBeTruthy();
  });

  it("apunta a la ruta correcta", () => {
    const { container } = render(
      <MemoryRouter>
        <Boton id={7} />
      </MemoryRouter>,
    );

    expect(container.querySelector("a")?.getAttribute("href"))
      .toBe("/Mascotas/7");
  });

  it("valida que el nombre del reclamo no esté vacío", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<FormularioContacto />);

    fireEvent.click(
      screen.getByRole("button", { name: /Enviar mensaje/i }),
    );

    expect(alertSpy).toHaveBeenCalledWith("Debe ingresar su nombre");
  });

  it("valida que el correo del reclamo no esté vacío", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<FormularioContacto />);

    const nombre = document.querySelector<HTMLInputElement>(
      'input[name="nombre"]',
    );

    fireEvent.change(nombre!, { target: { value: "Ana" } });
    fireEvent.click(
      screen.getByRole("button", { name: /Enviar mensaje/i }),
    );

    expect(alertSpy).toHaveBeenCalledWith("Debe ingresar su correo");
  });

  it("valida el formato del correo del reclamo", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<FormularioContacto />);

    const nombre = document.querySelector<HTMLInputElement>(
      'input[name="nombre"]',
    );
    const correo = document.querySelector<HTMLInputElement>(
      'input[name="correo"]',
    );

    fireEvent.change(nombre!, { target: { value: "Ana" } });
    fireEvent.change(correo!, { target: { value: "correo-invalido" } });
    fireEvent.click(
      screen.getByRole("button", { name: /Enviar mensaje/i }),
    );

    expect(alertSpy).toHaveBeenCalledWith("Ingrese un correo válido");
  });

  it("valida que el mensaje del reclamo no esté vacío", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<FormularioContacto />);

    const nombre = document.querySelector<HTMLInputElement>(
      'input[name="nombre"]',
    );
    const correo = document.querySelector<HTMLInputElement>(
      'input[name="correo"]',
    );

    fireEvent.change(nombre!, { target: { value: "Ana" } });
    fireEvent.change(correo!, { target: { value: "ana@test.com" } });
    fireEvent.click(
      screen.getByRole("button", { name: /Enviar mensaje/i }),
    );

    expect(alertSpy).toHaveBeenCalledWith("Debe ingresar un mensaje");
  });

  it("guarda un reclamo válido en el respaldo local si falla el servidor", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Servidor no disponible")),
    );

    render(<FormularioContacto />);

    const nombre = document.querySelector<HTMLInputElement>(
      'input[name="nombre"]',
    )!;
    const correo = document.querySelector<HTMLInputElement>(
      'input[name="correo"]',
    )!;
    const mensaje = document.querySelector<HTMLInputElement>(
      'input[name="mensaje"]',
    )!;

    fireEvent.change(nombre, { target: { value: "Ana" } });
    fireEvent.change(correo, { target: { value: "ana@test.com" } });
    fireEvent.change(mensaje, {
      target: { value: "Quiero reportar un problema" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Enviar mensaje/i }),
    );

    await waitFor(() => {
      const reclamos = JSON.parse(localStorage.getItem("reclamos") || "[]");

      expect(reclamos).toHaveLength(1);
      expect(reclamos[0]).toMatchObject({
        usuario: "ana@test.com",
        mensaje: "Quiero reportar un problema",
      });

      expect(nombre.value).toBe("");
      expect(correo.value).toBe("");
      expect(mensaje.value).toBe("");

      expect(alertSpy).toHaveBeenCalledWith(
        "Formulario enviado correctamente. Su reclamo ha sido registrado por el administrador.",
      );
    });
  });

  it("valida el nombre al registrarse", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <FormularioRegistro />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getAllByRole("button", { name: /Registrarse/i })[0],
    );

    expect(alertSpy).toHaveBeenCalledWith("Debe ingresar su nombre");
  });

  it("valida el correo al registrarse", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <FormularioRegistro />
      </MemoryRouter>,
    );

    const nombre = document.querySelector<HTMLInputElement>(
      'input[name="nombre"]',
    );
    const correo = document.querySelector<HTMLInputElement>(
      'input[name="correo"]',
    );
    const contrasena = document.querySelector<HTMLInputElement>(
      'input[name="contrasena"]',
    );

    fireEvent.change(nombre!, { target: { value: "Carlos" } });
    fireEvent.change(correo!, { target: { value: "correo-invalido" } });
    fireEvent.change(contrasena!, { target: { value: "12345678" } });

    fireEvent.click(
      screen.getAllByRole("button", { name: /Registrarse/i })[0],
    );

    expect(alertSpy).toHaveBeenCalledWith("Ingrese un correo válido");
  });

  it("rechaza una contraseña corta al registrarse", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <FormularioRegistro />
      </MemoryRouter>,
    );

    const nombre = document.querySelector<HTMLInputElement>(
      'input[name="nombre"]',
    );
    const correo = document.querySelector<HTMLInputElement>(
      'input[name="correo"]',
    );
    const contrasena = document.querySelector<HTMLInputElement>(
      'input[name="contrasena"]',
    );

    fireEvent.change(nombre!, { target: { value: "Carlos" } });
    fireEvent.change(correo!, { target: { value: "carlos@test.com" } });
    fireEvent.change(contrasena!, { target: { value: "123" } });

    fireEvent.click(
      screen.getAllByRole("button", { name: /Registrarse/i })[0],
    );

    expect(alertSpy).toHaveBeenCalledWith(
      "La contraseña debe tener al menos 8 caracteres",
    );
  });

  it("muestra el error del servidor si el correo ya está registrado", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          mensaje: "Este correo ya está registrado. Inicie sesión.",
        }),
      }),
    );

    render(
      <MemoryRouter>
        <FormularioRegistro />
      </MemoryRouter>,
    );

    const nombre = document.querySelector<HTMLInputElement>(
      'input[name="nombre"]',
    );
    const correo = document.querySelector<HTMLInputElement>(
      'input[name="correo"]',
    );
    const contrasena = document.querySelector<HTMLInputElement>(
      'input[name="contrasena"]',
    );

    fireEvent.change(nombre!, { target: { value: "Ana" } });
    fireEvent.change(correo!, { target: { value: "ana@test.com" } });
    fireEvent.change(contrasena!, { target: { value: "12345678" } });

    fireEvent.click(
      screen.getAllByRole("button", { name: /Registrarse/i })[0],
    );

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Este correo ya está registrado. Inicie sesión.",
      );
    });
  });

  it("envía el registro al servidor y muestra la confirmación", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    vi.stubGlobal("fetch", fetchMock);

    render(
      <MemoryRouter>
        <FormularioRegistro />
      </MemoryRouter>,
    );

    const nombre = document.querySelector<HTMLInputElement>(
      'input[name="nombre"]',
    );
    const correo = document.querySelector<HTMLInputElement>(
      'input[name="correo"]',
    );
    const contrasena = document.querySelector<HTMLInputElement>(
      'input[name="contrasena"]',
    );

    fireEvent.change(nombre!, { target: { value: "Luis" } });
    fireEvent.change(correo!, { target: { value: "luis@test.com" } });
    fireEvent.change(contrasena!, { target: { value: "12345678" } });

    fireEvent.click(
      screen.getAllByRole("button", { name: /Registrarse/i })[0],
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:8082/api/usuarios/registro",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            nombreCompleto: "Luis",
            correo: "luis@test.com",
            contrasena: "12345678",
          }),
        }),
      );

      expect(alertSpy).toHaveBeenCalledWith(
        "¡Registro exitoso! Ahora puede iniciar sesión.",
      );
    });
  });

  it("valida el correo al iniciar sesión", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <FormularioLogin />
      </MemoryRouter>,
    );

    const correo = document.querySelector<HTMLInputElement>(
      'input[name="correo"]',
    );
    const contrasena = document.querySelector<HTMLInputElement>(
      'input[name="contrasena"]',
    );

    fireEvent.change(correo!, { target: { value: "correo-no-valido" } });
    fireEvent.change(contrasena!, { target: { value: "12345678" } });

    fireEvent.click(
      screen.getAllByRole("button", { name: /Iniciar sesión/i })[0],
    );

    expect(alertSpy).toHaveBeenCalledWith("Debe ingresar un correo válido");
  });

  it("inicia sesión con la respuesta exitosa del servidor", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          token: "token-de-prueba",
          rol: "usuario",
          correo: "edwars@test.com",
          nombreCompleto: "Edwars",
        }),
      }),
    );

    render(
      <MemoryRouter>
        <FormularioLogin />
      </MemoryRouter>,
    );

    const correo = document.querySelector<HTMLInputElement>(
      'input[name="correo"]',
    );
    const contrasena = document.querySelector<HTMLInputElement>(
      'input[name="contrasena"]',
    );

    fireEvent.change(correo!, { target: { value: "edwars@test.com" } });
    fireEvent.change(contrasena!, { target: { value: "12345678" } });

    fireEvent.click(
      screen.getAllByRole("button", { name: /Iniciar sesión/i })[0],
    );

    await waitFor(() => {
      const usuarioLogueado = JSON.parse(
        localStorage.getItem("usuarioLogueado") || "null",
      );

      expect(usuarioLogueado).toMatchObject({
        nombre: "Edwars",
        correo: "edwars@test.com",
        rol: "usuario",
        token: "token-de-prueba",
      });

      expect(localStorage.getItem("token")).toBe("token-de-prueba");
      expect(alertSpy).toHaveBeenCalledWith("¡Bienvenido, Edwars!");
    });
  });
});