const express = require("express");
const router = express.Router();
const { updateUserController } = require("../Controller/updateUserController");
const { login } = require("../Controller/loginController");

// Ruta para actualizar usuario
router.put("/update/:id", updateUserController);
// Ruta para el login de usuario
router.post("/login", login);


module.exports = router;
