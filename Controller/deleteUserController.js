const { deleteUser, checkUserDependencies } = require("../Services/deleteUserService");

/**
 * Verifica si un usuario puede ser eliminado
 * GET /usuarios/eliminar/confirmar/:id
 */
const confirmDeleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const dependencyCheck = await checkUserDependencies(id);

        if (!dependencyCheck.canDelete) {
            return res.status(400).json({
                success: false,
                canDelete: false,
                message: dependencyCheck.reason,
                details: dependencyCheck.details
            });
        }

        res.json({
            success: true,
            canDelete: true,
            message: "El usuario puede ser eliminado de forma segura.",
            user: {
                id: dependencyCheck.user.id,
                name: dependencyCheck.user.name,
                email: dependencyCheck.user.email
            }
        });
    } catch (error) {
        console.error('Error al verificar usuario:', error);
        res.status(500).json({
            success: false,
            message: "Error al verificar el usuario."
        });
    }
}

/**
 * Elimina un usuario del sistema
 * DELETE /usuarios/eliminar/:id
 */
const deleteUserController = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await deleteUser(id);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message,
                details: result.details
            });
        }

        res.json({
            success: true,
            message: result.message,
            data: {
                id: result.deletedUser.id,
                name: result.deletedUser.name,
                email: result.deletedUser.email
            }
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario."
        });
    }
}

module.exports = {
    deleteUserController,
    confirmDeleteUser
};
