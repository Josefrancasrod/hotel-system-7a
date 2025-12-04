const express = require("express");
const router = express.Router();
const { updateUserController } = require("../Controller/updateUserController");
const { login } = require("../Controller/loginController");
const { create } = require("domain");
const { createUserController } = require("../Controller/createUserController");

// Ruta para actualizar usuario
router.put("/update/:id", updateUserController);
// Ruta para el login de usuario
router.post("/login", login);
// Ruta para crear un nuevo usuario
router.get("/create/", createUserController);   

module.exports = router;
