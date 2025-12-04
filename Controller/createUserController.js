//controlador para la creación de usuarios
const UserServices = require("..Services\UserServices.js");
const createUserController = async (req, res) => {
  try {
    const userData = req.body;      
    const newUser = await UserServices.createUser(userData);
    return res.status(201).json({
      message: "Usuario creado correctamente",
      user: newUser
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  } 
};

module.exports = { createUserController };