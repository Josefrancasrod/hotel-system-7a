const { updateUser } = require("../Services/UserServices");

const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Falta el ID del usuario" });
    }

    const updatedUser = await updateUser(id, req.body);

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      user: updatedUser
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { updateUserController };
