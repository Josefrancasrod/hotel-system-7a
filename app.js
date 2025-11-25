BigInt.prototype.toJSON = function () {
  return this.toString();
};

require('dotenv').config();

const express = require("express");
const Room = require("./Model/Room");
const Catalogo = require("./Model/Catalog");
const catalogRoutes = require("./Routes/CatalogRoutes");
const userRoutes = require("./Routes/userRoutes");

// 🚀 AQUI AGREGAMOS LAS RUTAS DE USUARIOS
const userRoutes = require("./Routes/userRoutes");

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

const PORT = 3000;

// Rutas principales
app.use("/api/catalog", catalogRoutes);
app.use("/api/users", userRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.json({ message: "Nothing here" });
});

app.post("/get", (req, res) => {
  console.log(req.body);
  res.json({ requestBody: "hello" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;
