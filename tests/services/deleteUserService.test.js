BigInt.prototype.toJSON = function () {
    return this.toString();
};

const { deleteUser, checkUserDependencies } = require("../../Services/deleteUserService");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('deleteUserService - Eliminar Usuario', () => {

    let testUserId;

    // Crear un usuario de prueba antes de los tests
    beforeAll(async () => {
        const testUser = await prisma.users.create({
            data: {
                name: "Usuario Test Delete",
                email: `testdelete${Date.now()}@example.com`
            }
        });
        testUserId = testUser.id;
    });

    // Limpiar después de los tests
    afterAll(async () => {
        // Intentar eliminar el usuario de prueba si aún existe
        try {
            await prisma.users.delete({
                where: { id: testUserId }
            });
        } catch (error) {
            // El usuario ya fue eliminado en los tests
        }
        await prisma.$disconnect();
    });

    test('checkUserDependencies - Debe verificar que un usuario sin dependencias puede ser eliminado', async () => {
        const result = await checkUserDependencies(testUserId);

        expect(result).toBeDefined();
        expect(result.canDelete).toBe(true);
        expect(result.user).toBeDefined();
        expect(result.user.id).toBe(testUserId);
    });

    test('checkUserDependencies - Debe retornar false para usuario inexistente', async () => {
        const fakeId = BigInt(999999999);
        const result = await checkUserDependencies(fakeId);

        expect(result).toBeDefined();
        expect(result.canDelete).toBe(false);
        expect(result.reason).toBe("Usuario no encontrado.");
    });

    test('deleteUser - Debe eliminar un usuario sin dependencias', async () => {
        const result = await deleteUser(testUserId);

        expect(result).toBeDefined();
        expect(result.success).toBe(true);
        expect(result.message).toBe("Usuario eliminado correctamente.");
        expect(result.deletedUser).toBeDefined();
        expect(result.deletedUser.id).toBe(testUserId);
    });

    test('deleteUser - No debe eliminar un usuario que ya fue eliminado', async () => {
        const result = await deleteUser(testUserId);

        expect(result).toBeDefined();
        expect(result.success).toBe(false);
    });

    test('checkUserDependencies - Debe detectar usuario con reservas', async () => {
        // Crear usuario con reserva
        const userWithReservation = await prisma.users.create({
            data: {
                name: "Usuario Con Reserva",
                email: `withreservation${Date.now()}@example.com`,
                reservations: {
                    create: {
                        room_number: 101,
                        start_date: new Date('2025-01-01'),
                        end_date: new Date('2025-01-05')
                    }
                }
            }
        });

        const result = await checkUserDependencies(userWithReservation.id);

        expect(result).toBeDefined();
        expect(result.canDelete).toBe(false);
        expect(result.reason).toContain("dependencias");
        expect(result.details.reservations).toBeGreaterThan(0);

        // Limpiar: eliminar reserva y usuario
        await prisma.reservations.deleteMany({
            where: { user_id: userWithReservation.id }
        });
        await prisma.users.delete({
            where: { id: userWithReservation.id }
        });
    });

    test('deleteUser - No debe eliminar usuario con dependencias', async () => {
        // Crear usuario con review
        const userWithReview = await prisma.users.create({
            data: {
                name: "Usuario Con Review",
                email: `withreview${Date.now()}@example.com`,
                reviews: {
                    create: {
                        rating: 5,
                        comment: "Excelente servicio"
                    }
                }
            }
        });

        const result = await deleteUser(userWithReview.id);

        expect(result).toBeDefined();
        expect(result.success).toBe(false);
        expect(result.message).toContain("dependencias");
        expect(result.details).toBeDefined();

        // Limpiar: eliminar review y usuario
        await prisma.reviews.deleteMany({
            where: { user_id: userWithReview.id }
        });
        await prisma.users.delete({
            where: { id: userWithReview.id }
        });
    });
});
