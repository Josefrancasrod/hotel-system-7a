const request = require("supertest");
const app = require("../../app");

// 🔥 Crear mock de Prisma directamente (sin importar nada)
const prisma = {
    reviews: {
        delete: jest.fn(),
        update: jest.fn(),
    }
};

// 🔥 Sobrescribir `app.set("prisma", prisma)` si lo usas — opcional
app.set("prisma", prisma);

jest.mock("@prisma/client", () => {
    return {
        PrismaClient: jest.fn(() => prisma)
    };
});

describe("Reviews - DELETE & UPDATE", () => {

    // DELETE
    test("Debe eliminar una review correctamente", async () => {
        prisma.reviews.delete.mockResolvedValue({
            id: 1,
            comentario: "borrado"
        });

        const res = await request(app).delete("/reviews/1");

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Review eliminada con éxito");
    });

    // UPDATE
    test("Debe actualizar una review correctamente", async () => {
        prisma.reviews.update.mockResolvedValue({
            id: 1,
            comentario: "Nuevo comentario",
        });

        const res = await request(app)
            .put("/reviews/1")
            .send({ comentario: "Nuevo comentario" });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Review actualizada con éxito");
    });
});
