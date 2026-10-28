// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Boton from "../src/componentes/atomos/Boton";
import FormularioContacto from "../src/componentes/organismos/FormularioContacto";
import FormularioRegistro from "../src/componentes/organismos/FormularioRegistro";
import FormularioLogin from "../src/componentes/organismos/FormularioLogin";

describe("Pruebas unitarias interesantes del proyecto", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("1) Botón muestra el texto Ver detalle", () => {
    render(
      <MemoryRouter>
        <Boton id={3} />
      </MemoryRouter>
    );

    expect(screen.getByText("Ver detalle")).toBeTruthy();
  });

  it("2) Botón apunta a la ruta correcta /Mascotas/:id", () => {
    const { container } = render(
      <MemoryRouter>
        <Boton id={7} />
      </MemoryRouter>
    );

    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe("/Mascotas/7");
  });

  it("3) FormularioContacto alerta si el nombre está vacío", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<FormularioContacto />);

    fireEvent.click(screen.getByRole("button", { name: /Enviar mensaje/i }));

    expect(alertSpy).toHaveBeenCalledWith("Debe ingresar su nombre");
  });

  it("4) FormularioContacto alerta si el correo está vacío", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<FormularioContacto />);

    const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
    fireEvent.change(nombreInput, { target: { value: "Ana" } });

    fireEvent.click(screen.getByRole("button", { name: /Enviar mensaje/i }));

    expect(alertSpy).toHaveBeenCalledWith("Debe ingresar su correo");
  });

  it("5) FormularioContacto alerta si el correo no tiene formato válido", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<FormularioContacto />);

    const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
    const correoInput = document.querySelector('input[name="correo"]') as HTMLInputElement;

    fireEvent.change(nombreInput, { target: { value: "Ana" } });
    fireEvent.change(correoInput, { target: { value: "correo-invalido" } });

    fireEvent.click(screen.getByRole("button", { name: /Enviar mensaje/i }));

    expect(alertSpy).toHaveBeenCalledWith("Ingrese un correo válido");
  });

  it("6) FormularioContacto alerta si el mensaje está vacío", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<FormularioContacto />);

    const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
    const correoInput = document.querySelector('input[name="correo"]') as HTMLInputElement;

    fireEvent.change(nombreInput, { target: { value: "Ana" } });
    fireEvent.change(correoInput, { target: { value: "ana@test.com" } });

    fireEvent.click(screen.getByRole("button", { name: /Enviar mensaje/i }));

    expect(alertSpy).toHaveBeenCalledWith("Debe ingresar un mensaje");
  });

  it("7) FormularioContacto guarda el reclamo en localStorage al enviar correctamente", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<FormularioContacto />);

    const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
    const correoInput = document.querySelector('input[name="correo"]') as HTMLInputElement;
    const mensajeInput = document.querySelector('input[name="mensaje"]') as HTMLInputElement;

    fireEvent.change(nombreInput, { target: { value: "Ana" } });
    fireEvent.change(correoInput, { target: { value: "ana@test.com" } });
    fireEvent.change(mensajeInput, { target: { value: "Quiero reportar un problema" } });

    fireEvent.click(screen.getByRole("button", { name: /Enviar mensaje/i }));

    const reclamos = JSON.parse(localStorage.getItem("reclamos") || "[]");
    expect(Array.isArray(reclamos)).toBe(true);
    expect(reclamos.length).toBeGreaterThan(0);

    expect(alertSpy).toHaveBeenCalledWith(
      "Formulario enviado correctamente. Su reclamo ha sido registrado por el administrador."
    );
  });

  it("8) FormularioContacto limpia los campos después de un envío exitoso", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<FormularioContacto />);

    const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
    const correoInput = document.querySelector('input[name="correo"]') as HTMLInputElement;
    const mensajeInput = document.querySelector('input[name="mensaje"]') as HTMLInputElement;

    fireEvent.change(nombreInput, { target: { value: "Ana" } });
    fireEvent.change(correoInput, { target: { value: "ana@test.com" } });
    fireEvent.change(mensajeInput, { target: { value: "Mensaje de prueba" } });

    fireEvent.click(screen.getByRole("button", { name: /Enviar mensaje/i }));

    expect(nombreInput.value).toBe("");
    expect(correoInput.value).toBe("");
    expect(mensajeInput.value).toBe("");

    expect(alertSpy).toHaveBeenCalledWith(
      "Formulario enviado correctamente. Su reclamo ha sido registrado por el administrador."
    );
  });

  it("9) FormularioRegistro alerta si el nombre está vacío", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <FormularioRegistro />
      </MemoryRouter>
    );

    const boton = screen.getAllByRole("button", { name: /Registrarse/i })[0];
    fireEvent.click(boton);

    expect(alertSpy).toHaveBeenCalledWith("Debe ingresar su nombre");
  });

  it("10) FormularioRegistro alerta si el correo no es válido", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <FormularioRegistro />
      </MemoryRouter>
    );

    const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
    const correoInput = document.querySelector('input[name="correo"]') as HTMLInputElement;
    const contrasenaInput = document.querySelector('input[name="contrasena"]') as HTMLInputElement;

    fireEvent.change(nombreInput, { target: { value: "Carlos" } });
    fireEvent.change(correoInput, { target: { value: "correo-invalido" } });
    fireEvent.change(contrasenaInput, { target: { value: "12345678" } });

    const boton = screen.getAllByRole("button", { name: /Registrarse/i })[0];
    fireEvent.click(boton);

    expect(alertSpy).toHaveBeenCalledWith("Ingrese un correo válido");
  });

  it("11) FormularioRegistro alerta si la contraseña tiene menos de 8 caracteres", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <FormularioRegistro />
      </MemoryRouter>
    );

    const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
    const correoInput = document.querySelector('input[name="correo"]') as HTMLInputElement;
    const contrasenaInput = document.querySelector('input[name="contrasena"]') as HTMLInputElement;

    fireEvent.change(nombreInput, { target: { value: "Carlos" } });
    fireEvent.change(correoInput, { target: { value: "carlos@test.com" } });
    fireEvent.change(contrasenaInput, { target: { value: "123" } });

    const boton = screen.getAllByRole("button", { name: /Registrarse/i })[0];
    fireEvent.click(boton);

    expect(alertSpy).toHaveBeenCalledWith("La contraseña debe tener al menos 8 caracteres");
  });

  it("12) FormularioRegistro alerta si el correo ya está registrado", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    localStorage.setItem(
      "usuarios",
      JSON.stringify([{ nombre: "Ana", correo: "ana@test.com", contrasena: "12345678" }])
    );

    render(
      <MemoryRouter>
        <FormularioRegistro />
      </MemoryRouter>
    );

    const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
    const correoInput = document.querySelector('input[name="correo"]') as HTMLInputElement;
    const contrasenaInput = document.querySelector('input[name="contrasena"]') as HTMLInputElement;

    fireEvent.change(nombreInput, { target: { value: "Ana" } });
    fireEvent.change(correoInput, { target: { value: "ana@test.com" } });
    fireEvent.change(contrasenaInput, { target: { value: "12345678" } });

    const boton = screen.getAllByRole("button", { name: /Registrarse/i })[0];
    fireEvent.click(boton);

    expect(alertSpy).toHaveBeenCalledWith("Este correo ya está registrado. Inicie sesión.");
  });

  it("13) FormularioRegistro guarda un usuario nuevo en localStorage", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <FormularioRegistro />
      </MemoryRouter>
    );

    const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
    const correoInput = document.querySelector('input[name="correo"]') as HTMLInputElement;
    const contrasenaInput = document.querySelector('input[name="contrasena"]') as HTMLInputElement;

    fireEvent.change(nombreInput, { target: { value: "Luis" } });
    fireEvent.change(correoInput, { target: { value: "luis@test.com" } });
    fireEvent.change(contrasenaInput, { target: { value: "12345678" } });

    const boton = screen.getAllByRole("button", { name: /Registrarse/i })[0];
    fireEvent.click(boton);

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    expect(usuarios.some((u: any) => u.correo === "luis@test.com")).toBe(true);

    expect(alertSpy).toHaveBeenCalledWith("¡Registro exitoso! Ahora puede iniciar sesión.");
  });

  it("14) FormularioLogin alerta si el correo no es válido", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <FormularioLogin />
      </MemoryRouter>
    );

    const correoInput = document.querySelector('input[name="correo"]') as HTMLInputElement;
    const contrasenaInput = document.querySelector('input[name="contrasena"]') as HTMLInputElement;

    fireEvent.change(correoInput, { target: { value: "correo-no-valido" } });
    fireEvent.change(contrasenaInput, { target: { value: "12345678" } });

    const boton = screen.getAllByRole("button", { name: /Iniciar sesión/i })[0];
    fireEvent.click(boton);

    expect(alertSpy).toHaveBeenCalledWith("Debe ingresar un correo válido");
  });

  it("15) FormularioLogin inicia sesión correctamente con usuario existente", () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    localStorage.setItem(
      "usuarios",
      JSON.stringify([{ nombre: "Edwars", correo: "edwars@test.com", contrasena: "12345678", rol: "usuario" }])
    );

    render(
      <MemoryRouter>
        <FormularioLogin />
      </MemoryRouter>
    );

    const correoInput = document.querySelector('input[name="correo"]') as HTMLInputElement;
    const contrasenaInput = document.querySelector('input[name="contrasena"]') as HTMLInputElement;

    fireEvent.change(correoInput, { target: { value: "edwars@test.com" } });
    fireEvent.change(contrasenaInput, { target: { value: "12345678" } });

    const boton = screen.getAllByRole("button", { name: /Iniciar sesión/i })[0];
    fireEvent.click(boton);

    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado") || "null");
    expect(usuarioLogueado?.correo).toBe("edwars@test.com");
    expect(usuarioLogueado?.rol).toBe("usuario");

    expect(alertSpy).toHaveBeenCalledWith("¡Bienvenido, Edwars!");
  });
});