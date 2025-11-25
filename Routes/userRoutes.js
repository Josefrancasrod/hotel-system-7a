const express = require("express");
const router = express.Router();
const { login } = require("../Controller/loginController");

// Ruta para el login de usuario
router.post("/login", login);

module.exports = router;
