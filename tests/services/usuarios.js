let usuarios = [];
let idCounter = 1;

function crearUsuario(nombre, rol) {
  const nuevoUsuario = { id: idCounter++, nombre, rol };
  usuarios.push(nuevoUsuario);
  return nuevoUsuario;
}

function obtenerUsuario(nombre) {
  return usuarios.find(u => u.nombre === nombre);
}

function actualizarUsuario(id, nuevoRol) {
  const usuario = usuarios.find(u => u.id === id);
  if (usuario) {
    usuario.rol = nuevoRol;
    return usuario;
  }
  return null;
}

function eliminarUsuario(id) {
  const index = usuarios.findIndex(u => u.id === id);
  if (index !== -1) {
    return usuarios.splice(index, 1)[0];
  }
  return null;
}

function login(nombre) {
  const usuario = obtenerUsuario(nombre);
  if (!usuario) return "Usuario no encontrado.";

  switch (usuario.rol) {
    case "Administrador":
      return `Bienvenido Administrador ${usuario.nombre}`;
    case "Trabajador":
      return "Acceso otorgado a la sección de trabajo.";
    case "Huésped":
      return "Bienvenido al modo de invitado.";
    default:
      return "Rol desconocido.";
  }
}

function reiniciarDatos() {
  usuarios = [];
  idCounter = 1; // 🔹 reinicia también el contador
}

module.exports = {
  crearUsuario,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  login,
  reiniciarDatos,
  usuarios
};
