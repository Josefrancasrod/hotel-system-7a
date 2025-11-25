const express = require("express");
const router = express.Router();

const { updateUserController } = require("../Controller/updateUserController");

// Ruta para actualizar usuario
router.put("/update/:id", updateUserController);

module.exports = router;
