const { login } = require("../../Controller/loginController");
const { loginUser } = require("../../Services/UserServices");
const { registerUser } = require("../../Services/UserServices")

// Mock del servicio real
jest.mock("../../Services/UserServices");

describe("Controlador: login", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        email: "fernando@example.com",
        password: "12345678",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("Debe hacer login correctamente", async () => {
    const mockResult = {
      user: {
        id: 1,
        nombre: "Fernando",
        apellidos: "Flores",
        email: "fernando@example.com",
        username: "ferflores",
        role: "user",
      },
      token: "mock.jwt.token",
    };

    loginUser.mockResolvedValue(mockResult);

    await login(req, res);

    expect(loginUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "fernando@example.com",
        password: "12345678",
      })
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login exitoso",
      user: mockResult.user,
      token: mockResult.token,
    });
  });

  test("Debe devolver error si faltan campos obligatorios", async () => {
    req.body = { email: "fernando@example.com" };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email y contraseña son obligatorios",
    });
  });

  test("Debe manejar errores de credenciales inválidas", async () => {
    loginUser.mockRejectedValue(new Error("Credenciales inválidas"));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Credenciales inválidas",
    });
  });

  test("Debe normalizar el email a minúsculas y quitar espacios", async () => {
    req.body.email = "  FERNANDO@EXAMPLE.COM  ";
    
    const mockResult = {
      user: { id: 1, email: "fernando@example.com" },
      token: "mock.jwt.token",
    };

    loginUser.mockResolvedValue(mockResult);

    await login(req, res);

    expect(loginUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "fernando@example.com",
      })
    );
  });
});