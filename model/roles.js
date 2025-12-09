// models/roles.js

let roles = [];
let contadorId = 1;

// Reinicia arreglo e ID (para pruebas)
function reiniciarRoles() {
  roles = [];
  contadorId = 1;
}

// Crear rol
function crearRol(nombre) {
  const nuevo = { id: contadorId++, nombre };
  roles.push(nuevo);
  return nuevo;
}

// Obtener rol por nombre
function obtenerRol(nombre) {
  return roles.find(r => r.nombre === nombre) || null;
}

// Obtener rol por ID
function obtenerRolPorId(id) {
  return roles.find(r => r.id === id) || null;
}

// Actualizar rol
function actualizarRol(id, nuevoNombre) {
  const rol = obtenerRolPorId(id);
  if (!rol) return null;
  rol.nombre = nuevoNombre;
  return rol;
}

// Eliminar rol
function eliminarRol(id) {
  const index = roles.findIndex(r => r.id === id);
  if (index === -1) return null;

  const eliminado = roles[index];
  roles.splice(index, 1);
  return eliminado;
}

module.exports = {
  roles,
  crearRol,
  obtenerRol,
  obtenerRolPorId,
  actualizarRol,
  eliminarRol,
  reiniciarRoles
};
