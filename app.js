// Convertir BigInt a JSON (Necesario para que Prisma no falle)
BigInt.prototype.toJSON = function () {
  return this.toString();
};

require("dotenv").config();

const express = require("express");

// Models (si los ocupas)
// Nota: Verifica que la carpeta sea "Model" o "model" según tu proyecto real
// const Room = require("./Model/Room");
// const Catalogo = require("./Model/Catalog");

// ------------------------------
//          IMPORTAR RUTAS
// ------------------------------
const dashboardRoutes = require('./Routes/DashboardRoutes'); // <--- TU NUEVA RUTA
const catalogRoutes = require("./Routes/CatalogRoutes");
const userRoutes = require("./Routes/userRoutes");
const rolesRoutes = require("./Routes/roles.routes");

// Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

const PORT = 3000;

// ------------------------------
//          ACTIVAR RUTAS
// ------------------------------
app.use("/api/catalog", catalogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/dashboard", dashboardRoutes); // <--- ESTA ERA LA QUE FALTABA

// Ruta base de prueba
app.get("/", (req, res) => {
  res.json({ message: "Nothing here" });
});

// Ejemplo POST
app.post("/get", (req, res) => {
  console.log(req.body);
  res.json({ requestBody: "hello" });
});

// ------------------------------
//          SERVIDOR
// ------------------------------
// Esta condición ayuda a que los tests no fallen al intentar abrir el puerto dos veces
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

module.exports = app;