// Convertir BigInt a JSON
BigInt.prototype.toJSON = function () {
  return this.toString();
};

require("dotenv").config();

const express = require("express");

// Models (si los ocupas en controladores)
const Room = require("./Model/Room");
const Catalogo = require("./Model/Catalog");

// Rutas
const catalogRoutes = require("./Routes/CatalogRoutes");
const userRoutes = require("./Routes/userRoutes");
const rolesRoutes = require("./Routes/roles.routes"); // <-- AGREGADO

// Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

const PORT = 3000;

// ------------------------------
//            RUTAS
// ------------------------------
app.use("/api/catalog", catalogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", rolesRoutes); // <-- AGREGADO

// Ruta base
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
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;
