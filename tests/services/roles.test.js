const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

beforeAll(async () => {
  // Limpiar tabla antes de iniciar pruebas
  await prisma.role.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("CRUD de Roles", () => {

  let createdRoleId;

  // CREATE
  test("POST /api/roles → debería crear un rol", async () => {
    const response = await request(app)
      .post("/api/roles")
      .send({
        name: "tester",
        description: "Rol creado en test"
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("tester");

    createdRoleId = response.body.id;
  });

  // READ ALL
  test("GET /api/roles → debería listar roles", async () => {
    const response = await request(app).get("/api/roles");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // READ ONE
  test("GET /api/roles/:id → debería obtener un rol por ID", async () => {
    const response = await request(app).get(`/api/roles/${createdRoleId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdRoleId);
  });

  // UPDATE
  test("PUT /api/roles/:id → debería actualizar un rol", async () => {
    const response = await request(app)
      .put(`/api/roles/${createdRoleId}`)
      .send({
        name: "tester_updated",
        description: "Rol actualizado"
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("tester_updated");
  });

  // DELETE
  test("DELETE /api/roles/:id → debería eliminar un rol", async () => {
    const response = await request(app).delete(`/api/roles/${createdRoleId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Role deleted");
  });

});
