const { deleteReview } = require("../../Controller/ReviewsController");
const { deleteReviewService } = require("../../Services/ReviewsServices");

jest.mock("../../Services/ReviewsServices");

describe("Controlador: deleteReview", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {
        userId: "10",
        reviewId: "5",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("Debe eliminar la reseña correctamente", async () => {
    const mockResult = { id: 5, message: "Review eliminada" };

    deleteReviewService.mockResolvedValue(mockResult);

    await deleteReview(req, res);

    expect(deleteReviewService).toHaveBeenCalledWith(10, 5);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Reseña eliminada correctamente",
      result: mockResult,
    });
  });

  test("Debe devolver error si faltan parámetros", async () => {
    req.params = {};

    await deleteReview(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Se requieren userId y reviewId",
    });
  });

  test("Debe manejar errores lanzados por el servicio", async () => {
    deleteReviewService.mockRejectedValue(
      new Error("La reseña no existe o no pertenece al usuario")
    );

    await deleteReview(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "La reseña no existe o no pertenece al usuario",
    });
  });
});
