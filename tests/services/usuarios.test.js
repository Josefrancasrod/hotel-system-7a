const {
  crearUsuario,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  login,
  reiniciarDatos,
  usuarios
} = require("./usuarios");

beforeEach(() => {
  reiniciarDatos();
});

test("Debe crear un usuario correctamente", () => {
  const usuario = crearUsuario("Juan Pu00e9rez", "Administrador");
  expect(usuario.nombre).toBe("Juan Pu00e9rez");
  expect(usuario.rol).toBe("Administrador");
});

test("Debe obtener un usuario por nombre", () => {
  crearUsuario("Ana Lu00f3pez", "Huu00e9sped");
  const usuario = obtenerUsuario("Ana Lu00f3pez");
  expect(usuario).toBeDefined();
  expect(usuario.rol).toBe("Huu00e9sped");
});

test("Debe actualizar el rol de un usuario existente", () => {
  crearUsuario("Carlos Ruiz", "Huu00e9sped");
  const actualizado = actualizarUsuario(1, "Trabajador");
  expect(actualizado).not.toBeNull();
  expect(actualizado.rol).toBe("Trabajador");
});

test("Debe eliminar un usuario correctamente", () => {
  crearUsuario("Luis Torres", "Trabajador");
  const eliminado = eliminarUsuario(1);
  expect(eliminado).not.toBeNull();
  expect(eliminado.nombre).toBe("Luis Torres");
  expect(usuarios.length).toBe(0);
});

test("Debe mostrar mensaje correcto al iniciar sesiu00f3n segu00fan rol", () => {
  crearUsuario("Pedro Du00edaz", "Administrador");
  const mensaje = login("Pedro Du00edaz");
  expect(mensaje).toBe("Bienvenido Administrador Pedro Du00edaz");
});

test("Debe indicar cuando el usuario no existe", () => {
  const mensaje = login("UsuarioInexistente");
  expect(mensaje).toBe("Usuario no encontrado.");
});
