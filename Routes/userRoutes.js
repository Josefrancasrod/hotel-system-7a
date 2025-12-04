const express = require("express");
const router = express.Router();
const { updateUserController } = require("../Controller/updateUserController");
const { login } = require("../Controller/loginController");
const { filterUsersController } = require("../Controller/filterUsersController");

// Ruta para actualizar usuario
router.put("/update/:id", updateUserController);
// Ruta para el login de usuario
router.post("/login", login);
// Ruta para filtrar usuarios
router.get("/filter", filterUsersController);


module.exports = router;
