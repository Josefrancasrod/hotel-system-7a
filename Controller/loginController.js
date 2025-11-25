const { loginUser } = require("../Services/UserServices");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos obligatorios
    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son obligatorios",
      });
    }

    // Normalizar email
    const normalizedEmail = email.trim().toLowerCase();

    // Llamar al service
    const { user, token } = await loginUser({
      email: normalizedEmail,
      password,
    });

    return res.status(200).json({
      message: "Login exitoso",
      user,
      token,
    });
  } catch (error) {
    if (error.message === "Credenciales inválidas") {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    console.error("Error en loginController:", error);
    
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

module.exports = { login };
