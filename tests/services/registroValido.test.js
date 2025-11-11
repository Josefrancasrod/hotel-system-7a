const { register } = require("../../Controller/registerController");
const { registerUser } = require("../../Services/UserServices");

// 🔹 Mock del servicio real
jest.mock("../../Services/UserServices");

describe("Controlador: register", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        nombre: "Fernando",
        apellidos: "Flores",
        email: "fernando@example.com",
        username: "ferflores",
        cell_number: "1234567890",
        password: "12345678",
        role: "user",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("✅ Debe registrar un usuario correctamente", async () => {
    const mockUser = {
      id: 1,
      nombre: "Fernando",
      apellidos: "Flores",
      email: "fernando@example.com",
      username: "ferflores",
      role: "user",
    };

    registerUser.mockResolvedValue(mockUser);

    await register(req, res);

    expect(registerUser).toHaveBeenCalledWith(expect.objectContaining({
      nombre: "Fernando",
      apellidos: "Flores",
      email: "fernando@example.com",
      username: "ferflores",
      password: "12345678",
    }));

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuario registrado correctamente",
      user: mockUser,
    });
  });

  test("❌ Debe devolver error si faltan campos obligatorios", async () => {
    req.body = { nombre: "SoloNombre" };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Todos los campos obligatorios deben completarse",
    });
  });

  test("❌ Debe manejar errores lanzados por registerUser", async () => {
    registerUser.mockRejectedValue(new Error("El email ya está registrado"));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El email ya está registrado",
    });
  });
});
