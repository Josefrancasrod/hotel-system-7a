const { registerUser } = require("../Services/UserServices");

const register = async (req, res) => {
  try {
    const { nombre, apellidos, email, username, cell_number, password, role } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !apellidos || !email || !username || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos obligatorios deben completarse" });
    }

    // Intentar registrar al usuario
    const user = await registerUser({
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      email: email.trim().toLowerCase(),
      username: username.trim(),
      cell_number: cell_number || null,
      password,
      role,
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user,
    });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error.message);
    return res.status(400).json({
      message:
        error.message || "Ocurrió un error al intentar registrar el usuario",
    });
  }
};

module.exports = { register };
