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
        nombre: "Aaron",
        apellidos: "Carrillo",
        email: "nando@example.com",
        username: "Ferxdc",
        cell_number: "489284924",
        password: "4i4i0i0391",
        role: "user",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("Debe registrar un usuario correctamente", async () => {
    const mockUser = {
      id: 1,
      nombre: "Aaron",
      apellidos: "Carrillo",
      email: "nando@example.com",
      username: "Ferxdc",
      role: "user",
    };

    // Simula que el servicio devuelve un usuario registrado
    registerUser.mockResolvedValue(mockUser);

    // Ejecuta el controlador
    await register(req, res);

    // Verifica que el servicio se llamó con los mismos datos que vienen en req.body
    expect(registerUser).toHaveBeenCalledWith(expect.objectContaining({
      nombre: "Aaron",
      apellidos: "Carrillo",
      email: "nando@example.com",
      username: "Ferxdc",
      password: "4i4i0i0391",
    }));

    // Verifica la respuesta del controlador
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuario registrado correctamente",
      user: mockUser,
    });
  });

  test("Debe devolver error si faltan campos obligatorios", async () => {
    req.body = { nombre: "SoloNombre" };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Todos los campos obligatorios deben completarse",
    });
  });

  test("Debe manejar errores lanzados por registerUser", async () => {
    registerUser.mockRejectedValue(new Error("El email ya está registrado"));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El email ya está registrado",
    });
  });
});
