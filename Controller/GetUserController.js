const { getAllUsers, getUserById } = require("../Services/UsuarioServices");

// Mostrar todos los usuarios (vista general o JSON)
const listarUsuarios = async (req, res) => {
    console.log("Listando usuarios...");

    const users = await getAllUsers();
    res.json(users);
};

// (Opcional) Cuando la petición viene por AJAX
const listarUsuariosAjax = async (req, res) => {
    console.log("Listando usuarios AJAX...");

    const users = await getAllUsers();
    res.json({
        message: "Usuarios obtenidos correctamente",
        data: users
    });
};

// Mostrar un usuario específico
const verUsuario = async (req, res) => {
    const { id } = req.params;
    console.log("Buscando usuario:", id);

    const user = await getUserById(id);
    res.json(user);
};

module.exports = { listarUsuarios, listarUsuariosAjax, verUsuario };