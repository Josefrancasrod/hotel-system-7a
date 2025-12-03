const { updateUserController } = require("../../Controller/updateUserController");
const { updateUser } = require("../../Services/UserServices");

jest.mock("../../Services/UserServices");

describe("Controlador: updateUser", () => {
  test("Debe actualizar un usuario correctamente", async () => {
    const req = {
      params: { id: "1" },
      body: { nombre: "Nuevo Nombre" }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const updatedUser = { id: 1, nombre: "Nuevo Nombre" };

    updateUser.mockResolvedValue(updatedUser);

    await updateUserController(req, res);

    expect(updateUser).toHaveBeenCalledWith("1", { nombre: "Nuevo Nombre" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuario actualizado correctamente",
      user: updatedUser
    });
  });

  test("Debe mostrar error si falta el ID", async () => {
    const req = {
      params: {},
      body: {}
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await updateUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Falta el ID del usuario"
    });
  });
});
