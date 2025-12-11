// Mock del prisma
jest.mock("../../config/prisma.js", () => ({
  prisma: {
    review: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

const { prisma } = require("../../config/prisma.js");
const { updateReview } = require("../../Controller/ReviewsController");

describe("Controlador: updateReview", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: { reviewId: 1 },
      body: {
        userId: 10,
        title: "Nuevo título",
        content: "Contenido actualizado",
        rating: 5,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // ==========================================
  // ✔ Caso 1: Reseña actualizada correctamente
  // ==========================================
  test("Debe actualizar correctamente una reseña", async () => {
    const mockReview = {
      id: 1,
      userId: 10,
      title: "Título viejo",
      content: "Contenido viejo",
      rating: 3,
    };

    const updatedReview = {
      id: 1,
      userId: 10,
      title: "Nuevo título",
      content: "Contenido actualizado",
      rating: 5,
    };

    prisma.review.findUnique.mockResolvedValue(mockReview);
    prisma.review.update.mockResolvedValue(updatedReview);

    await updateReview(req, res);

    expect(prisma.review.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(prisma.review.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: expect.objectContaining({
        title: "Nuevo título",
        content: "Contenido actualizado",
        rating: 5,
      }),
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      funcion: "updateReview",
      descripcion: "Actualiza una reseña existente creada por un usuario.",
      message: "Reseña actualizada exitosamente",
      updatedReview,
    });
  });

  // ==========================================
  // ❌ Caso 2: La reseña no existe
  // ==========================================
  test("Debe devolver error si la reseña no existe", async () => {
    prisma.review.findUnique.mockResolvedValue(null);

    await updateReview(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "La reseña no existe",
    });
  });

  // ==========================================
  // ❌ Caso 3: La reseña no pertenece al usuario
  // ==========================================
  test("Debe devolver error si la reseña no pertenece al usuario", async () => {
    const mockReview = { id: 1, userId: 99 }; // otro usuario

    prisma.review.findUnique.mockResolvedValue(mockReview);

    await updateReview(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "No tienes permiso para editar esta reseña",
    });
  });

  // ==========================================
  // ❌ Caso 4: Error inesperado del servidor
  // ==========================================
  test("Debe manejar errores internos", async () => {
    prisma.review.findUnique.mockRejectedValue(new Error("Error interno"));

    await updateReview(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error al actualizar la reseña",
    });
  });
});
