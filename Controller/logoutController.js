const { logoutUser } = require("../Services/UserServices");

const logout = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "El ID de usuario es obligatorio para cerrar sesión" });
    }

    const result = await logoutUser(userId);

    return res.status(200).json({
      message: "Sesión cerrada correctamente",
      result,
    });
  } catch (error) {
    console.error("❌ Error al cerrar sesión:", error.message);
    return res.status(400).json({
      message: error.message || "Ocurrió un error al intentar cerrar sesión",
    });
  }
};

module.exports = { logout };
