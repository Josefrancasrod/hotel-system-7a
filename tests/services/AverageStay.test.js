const { getAverageStay } = require("../../Controller/AverageStayController");
const prisma = require("../../prisma/prismaClient");

jest.mock("../../prisma/prismaClient", () => ({
  booking: {
    findMany: jest.fn(),
  },
}));

describe("Controlador: getAverageStay", () => {
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

  test("Debe calcular el promedio de estancia correctamente", async () => {
    const mockBookings = [
      { checkIn: new Date("2023-10-01"), checkOut: new Date("2023-10-04") }, // 3 días
      { checkIn: new Date("2023-10-10"), checkOut: new Date("2023-10-15") }, // 5 días
    ];

    prisma.booking.findMany.mockResolvedValue(mockBookings);

    await getAverageStay(req, res);

    expect(prisma.booking.findMany).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      totalReservations: 2,
      averageStayDays: 4.00
    });
  });

  test("Debe manejar el caso de 0 reservas", async () => {
    prisma.booking.findMany.mockResolvedValue([]);

    await getAverageStay(req, res);

    expect(res.json).toHaveBeenCalledWith({
      averageStayDays: 0,
      message: "No hay reservas registradas"
    });
  });

  test("Debe manejar errores de la base de datos", async () => {
    prisma.booking.findMany.mockRejectedValue(new Error("Error de conexión"));

    await getAverageStay(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error al calcular el promedio"
    });
  });
});