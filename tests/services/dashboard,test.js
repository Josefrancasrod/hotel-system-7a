const request = require("supertest");
const app = require("../../app"); // Importamos tu aplicación
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("GET /api/dashboard/metrics", () => {
  
  let userEmail = `test_dashboard_${Date.now()}@example.com`;
  let userId;

  // Antes de todas las pruebas, creamos un usuario en el mes actual para probar
  beforeAll(async () => {
    const newUser = await prisma.users.create({
      data: {
        nombre: "Usuario",
        apellidos: "De Prueba",
        email: userEmail,
        username: `user_${Date.now()}`,
        password: "password123",
        role: "user",
        created_at: new Date() // Se crea con fecha de HOY
      }
    });
    userId = newUser.id;
  });

  // Al finalizar, borramos el usuario para no ensuciar la base de datos
  afterAll(async () => {
    if (userId) {
      await prisma.users.delete({ where: { id: userId } });
    }
    await prisma.$disconnect();
  });

  test("Debería retornar status 200 y datos cuando se envía mes y año", async () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // JS usa meses 0-11
    const currentYear = today.getFullYear();

    const response = await request(app)
      .get(`/api/dashboard/metrics?month=${currentMonth}&year=${currentYear}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    
    // Verificamos que al menos encuentre el usuario que acabamos de crear
    const foundUser = response.body.data.find(u => u.email === userEmail);
    expect(foundUser).toBeDefined();
  });

  test("Debería retornar error 400 si faltan parámetros", async () => {
    const response = await request(app).get("/api/dashboard/metrics"); // Sin ?month ni ?year
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

});