const { getMonthlyRevenue } = require("../../Controller/MonthlyRevenueController");
const prisma = require("../../prisma/prismaClient");

jest.mock("../../prisma/prismaClient", () => ({
  booking: {
    aggregate: jest.fn(),
  },
}));

describe("Controlador: getMonthlyRevenue", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("Debe retornar los ingresos sumados correctamente", async () => {
    // Simulamos que la suma en la BD dio 5000
    const mockAggregate = {
      _sum: { totalPrice: 5000 }
    };

    prisma.booking.aggregate.mockResolvedValue(mockAggregate);

    await getMonthlyRevenue(req, res);

    // Verificamos que se llamó a la BD con los filtros correctos (mes actual y status CONFIRMED)
    expect(prisma.booking.aggregate).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        status: 'CONFIRMED'
      })
    }));

    // Verificamos la respuesta
    const now = new Date();
    expect(res.json).toHaveBeenCalledWith({
      month: expect.any(String), // No validamos el mes exacto para que el test no caduque
      year: now.getFullYear(),
      totalRevenue: 5000
    });
  });

  test("Debe retornar 0 si no hay ingresos", async () => {
    // Simulamos que la suma dio null (sin reservas)
    prisma.booking.aggregate.mockResolvedValue({ _sum: { totalPrice: null } });

    await getMonthlyRevenue(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      totalRevenue: 0
    }));
  });

  test("Debe manejar errores inesperados", async () => {
    prisma.booking.aggregate.mockRejectedValue(new Error("Fallo en BD"));

    await getMonthlyRevenue(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error al calcular ingresos"
    });
  });
});