const {
  crearRol,
  obtenerRol,
  obtenerRoles,
  actualizarRol,
  eliminarRol,
  reiniciarDatos,
  roles
} = require("./roles");

beforeEach(() => {
  reiniciarDatos(); // reinicia antes de cada test
});

test("Debe crear un rol correctamente", () => {
  const rol = crearRol("Administrador", "Control total del sistema");
  expect(rol.name).toBe("Administrador");
  expect(rol.description).toBe("Control total del sistema");
});

test("Debe obtener un rol por ID", () => {
  const creado = crearRol("Editor", "Puede modificar contenido");
  const rol = obtenerRol(creado.id);
  expect(rol).toBeDefined();
  expect(rol.name).toBe("Editor");
});

test("Debe obtener todos los roles", () => {
  crearRol("A", "Desc");
  crearRol("B", "Desc");
  const lista = obtenerRoles();
  expect(lista.length).toBe(2);
});

test("Debe actualizar un rol existente", () => {
  crearRol("Usuario", "Descripción inicial");
  const actualizado = actualizarRol(1, "Usuario Premium", "Acceso extendido");
  expect(actualizado).not.toBeNull();
  expect(actualizado.name).toBe("Usuario Premium");
  expect(actualizado.description).toBe("Acceso extendido");
});

test("Debe eliminar un rol correctamente", () => {
  crearRol("Tester", "Pruebas del sistema");
  const eliminado = eliminarRol(1);
  expect(eliminado).not.toBeNull();
  expect(eliminado.name).toBe("Tester");
  expect(roles.length).toBe(0);
});

test("Debe regresar null si intenta eliminar un ID inexistente", () => {
  const eliminado = eliminarRol(99);
  expect(eliminado).toBeNull();
});
