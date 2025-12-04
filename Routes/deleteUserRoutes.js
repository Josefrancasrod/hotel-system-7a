const express = require('express');
const router = express.Router();
const {
    deleteUserController,
    confirmDeleteUser
} = require('../Controller/deleteUserController');

/**
 * GET /usuarios/eliminar/confirmar/:id
 * Verifica si un usuario puede ser eliminado (opcional)
 */
router.get('/eliminar/confirmar/:id', confirmDeleteUser);

/**
 * DELETE /usuarios/eliminar/:id
 * POST /usuarios/eliminar/:id
 * Elimina un usuario del sistema
 */
router.delete('/eliminar/:id', deleteUserController);
router.post('/eliminar/:id', deleteUserController);

module.exports = router;
