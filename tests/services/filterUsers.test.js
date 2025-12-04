// Mock de Prisma antes de importar cualquier módulo que lo use
jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      users: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    })),
  };
});

// Mock del servicio real
jest.mock("../../Services/FilterUsersServices");

const { filterUsersController } = require("../../Controller/filterUsersController");
const { filterUsers } = require("../../Services/FilterUsersServices");

describe("Controlador: filterUsers", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("Debe filtrar usuarios correctamente con filtro por nombre", async () => {
    req.query = {
      nombre: "Fernando",
      page: "1",
      limit: "10",
    };

    const mockResult = {
      users: [
        {
          id: 1,
          nombre: "Fernando",
          apellidos: "Castillo Domínguez",
          email: "fernando@example.com",
          username: "nandodcx",
          cell_number: "6181234567",
          role: "user",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };

    filterUsers.mockResolvedValue(mockResult);

    await filterUsersController(req, res);

    expect(filterUsers).toHaveBeenCalledWith({
      nombre: "Fernando",
      apellidos: undefined,
      email: undefined,
      username: undefined,
      role: undefined,
      cell_number: undefined,
      page: "1",
      limit: "10",
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuarios filtrados correctamente",
      users: mockResult.users,
      pagination: mockResult.pagination,
    });
  });

  test("Debe filtrar usuarios correctamente con múltiples filtros", async () => {
    req.query = {
      nombre: "Fernando",
      role: "user",
      page: "1",
      limit: "5",
    };

    const mockResult = {
      users: [
        {
          id: 1,
          nombre: "Fernando",
          apellidos: "Castillo Domínguez",
          email: "fernando@example.com",
          username: "nandodcx",
          cell_number: "6181234567",
          role: "user",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      pagination: {
        page: 1,
        limit: 5,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };

    filterUsers.mockResolvedValue(mockResult);

    await filterUsersController(req, res);

    expect(filterUsers).toHaveBeenCalledWith({
      nombre: "Fernando",
      apellidos: undefined,
      email: undefined,
      username: undefined,
      role: "user",
      cell_number: undefined,
      page: "1",
      limit: "5",
    });

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("Debe usar valores por defecto para page y limit cuando no se proporcionan", async () => {
    req.query = {
      nombre: "Fernando",
    };

    const mockResult = {
      users: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };

    filterUsers.mockResolvedValue(mockResult);

    await filterUsersController(req, res);

    expect(filterUsers).toHaveBeenCalledWith({
      nombre: "Fernando",
      apellidos: undefined,
      email: undefined,
      username: undefined,
      role: undefined,
      cell_number: undefined,
      page: 1,
      limit: 10,
    });
  });

  test("Debe retornar mensaje cuando no se encuentran usuarios", async () => {
    req.query = {
      nombre: "NoExiste",
    };

    const mockResult = {
      users: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };

    filterUsers.mockResolvedValue(mockResult);

    await filterUsersController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "No se encontraron usuarios con los criterios especificados",
      users: [],
      pagination: mockResult.pagination,
    });
  });

  test("Debe validar que page sea un número válido mayor a 0", async () => {
    req.query = {
      page: "0",
    };

    await filterUsersController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El parámetro 'page' debe ser un número mayor a 0",
    });
    expect(filterUsers).not.toHaveBeenCalled();
  });

  test("Debe validar que page no sea negativo", async () => {
    req.query = {
      page: "-1",
    };

    await filterUsersController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El parámetro 'page' debe ser un número mayor a 0",
    });
  });

  test("Debe validar que page no sea NaN", async () => {
    req.query = {
      page: "abc",
    };

    await filterUsersController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El parámetro 'page' debe ser un número mayor a 0",
    });
  });

  test("Debe validar que limit sea un número válido mayor a 0", async () => {
    req.query = {
      limit: "0",
    };

    await filterUsersController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El parámetro 'limit' debe ser un número mayor a 0",
    });
    expect(filterUsers).not.toHaveBeenCalled();
  });

  test("Debe validar que limit no sea negativo", async () => {
    req.query = {
      limit: "-5",
    };

    await filterUsersController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El parámetro 'limit' debe ser un número mayor a 0",
    });
  });

  test("Debe validar que role sea 'user' o 'admin'", async () => {
    req.query = {
      role: "invalid_role",
    };

    await filterUsersController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El parámetro 'role' debe ser 'user' o 'admin'",
    });
    expect(filterUsers).not.toHaveBeenCalled();
  });

  test("Debe aceptar role 'user'", async () => {
    req.query = {
      role: "user",
    };

    const mockResult = {
      users: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };

    filterUsers.mockResolvedValue(mockResult);

    await filterUsersController(req, res);

    expect(filterUsers).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("Debe aceptar role 'admin'", async () => {
    req.query = {
      role: "admin",
    };

    const mockResult = {
      users: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };

    filterUsers.mockResolvedValue(mockResult);

    await filterUsersController(req, res);

    expect(filterUsers).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("Debe manejar errores lanzados por filterUsers", async () => {
    req.query = {
      nombre: "Fernando",
    };

    filterUsers.mockRejectedValue(new Error("Error de base de datos"));

    await filterUsersController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error al filtrar usuarios",
      error: "Error de base de datos",
    });
  });

  test("Debe filtrar por email correctamente", async () => {
    req.query = {
      email: "fernando@example.com",
    };

    const mockResult = {
      users: [
        {
          id: 1,
          nombre: "Fernando",
          apellidos: "Castillo Domínguez",
          email: "fernando@example.com",
          username: "nandodcx",
          role: "user",
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };

    filterUsers.mockResolvedValue(mockResult);

    await filterUsersController(req, res);

    expect(filterUsers).toHaveBeenCalledWith({
      nombre: undefined,
      apellidos: undefined,
      email: "fernando@example.com",
      username: undefined,
      role: undefined,
      cell_number: undefined,
      page: 1,
      limit: 10,
    });
  });

  test("Debe filtrar por username correctamente", async () => {
    req.query = {
      username: "nandodcx",
    };

    const mockResult = {
      users: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };

    filterUsers.mockResolvedValue(mockResult);

    await filterUsersController(req, res);

    expect(filterUsers).toHaveBeenCalledWith({
      nombre: undefined,
      apellidos: undefined,
      email: undefined,
      username: "nandodcx",
      role: undefined,
      cell_number: undefined,
      page: 1,
      limit: 10,
    });
  });

  test("Debe filtrar por apellidos correctamente", async () => {
    req.query = {
      apellidos: "Castillo",
    };

    const mockResult = {
      users: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };

    filterUsers.mockResolvedValue(mockResult);

    await filterUsersController(req, res);

    expect(filterUsers).toHaveBeenCalledWith({
      nombre: undefined,
      apellidos: "Castillo",
      email: undefined,
      username: undefined,
      role: undefined,
      cell_number: undefined,
      page: 1,
      limit: 10,
    });
  });

  test("Debe filtrar por cell_number correctamente", async () => {
    req.query = {
      cell_number: "6181234567",
    };

    const mockResult = {
      users: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };

    filterUsers.mockResolvedValue(mockResult);

    await filterUsersController(req, res);

    expect(filterUsers).toHaveBeenCalledWith({
      nombre: undefined,
      apellidos: undefined,
      email: undefined,
      username: undefined,
      role: undefined,
      cell_number: "6181234567",
      page: 1,
      limit: 10,
    });
  });
});

