const { logout } = require("../../Controller/logoutController");
const { logoutUser } = require("../../Services/UserServices");

jest.mock("../../Services/UserServices");

describe("Controlador: logout", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        userId: 1,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("Debe cerrar la sesión correctamente", async () => {
    const mockResult = { userId: 1, status: "Sesión cerrada" };
    logoutUser.mockResolvedValue(mockResult);

    await logout(req, res);

    expect(logoutUser).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Sesión cerrada correctamente",
      result: mockResult,
    });
  });

  test("Debe devolver error si no se envía el userId", async () => {
    req.body = {}; // Sin userId

    await logout(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El ID de usuario es obligatorio para cerrar sesión",
    });
  });

  test("Debe manejar errores lanzados por logoutUser", async () => {
    logoutUser.mockRejectedValue(new Error("Usuario no encontrado"));

    await logout(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuario no encontrado",
    });
  });
});
