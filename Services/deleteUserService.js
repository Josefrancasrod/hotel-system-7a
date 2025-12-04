const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Verifica si un usuario tiene dependencias (reservas o reviews)
 * @param {BigInt} userId - ID del usuario a verificar
 * @returns {Object} - Objeto con información sobre si puede ser eliminado
 */
const checkUserDependencies = async (userId) => {
    try {
        const user = await prisma.users.findUnique({
            where: { id: BigInt(userId) },
            include: {
                reservations: true,
                reviews: true
            }
        });

        if (!user) {
            return {
                canDelete: false,
                reason: "Usuario no encontrado."
            };
        }

        const hasReservations = user.reservations && user.reservations.length > 0;
        const hasReviews = user.reviews && user.reviews.length > 0;

        if (hasReservations || hasReviews) {
            return {
                canDelete: false,
                reason: "No se puede eliminar el usuario porque tiene dependencias.",
                details: {
                    reservations: user.reservations.length,
                    reviews: user.reviews.length
                }
            };
        }

        return { canDelete: true, user };
    } catch (error) {
        console.error('Error al verificar dependencias:', error);
        return {
            canDelete: false,
            reason: "Error al verificar dependencias."
        };
    }
}

/**
 * Elimina un usuario del sistema (eliminación física)
 * @param {BigInt} userId - ID del usuario a eliminar
 * @returns {Object} - Resultado de la operación
 */
const deleteUser = async (userId) => {
    try {
        // Verificar dependencias primero
        const dependencyCheck = await checkUserDependencies(userId);

        if (!dependencyCheck.canDelete) {
            return {
                success: false,
                message: dependencyCheck.reason,
                details: dependencyCheck.details
            };
        }

        // Si no hay dependencias, proceder con la eliminación física
        const deletedUser = await prisma.users.delete({
            where: { id: BigInt(userId) }
        });

        return {
            success: true,
            message: "Usuario eliminado correctamente.",
            deletedUser
        };
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return {
            success: false,
            message: "Error al eliminar el usuario.",
            error: error.message
        };
    }
}

module.exports = {
    deleteUser,
    checkUserDependencies
};
