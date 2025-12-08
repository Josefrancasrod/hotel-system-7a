const express = require("express");
const router = express.Router();

const { 
    listarUsuarios, 
    listarUsuariosAjax, 
    verUsuario 
} = require("../Controller/UsuarioController");

// Lista general (HTML o JSON)
router.get("/lista", listarUsuarios);

// Lista por AJAX (solo JSON)
router.get("/lista/ajax", listarUsuariosAjax);

// Ver un usuario específico
router.get("/ver/:id", verUsuario);

module.exports = router;