BigInt.prototype.toJSON = function () {
  return this.toString();
};

require('dotenv').config();
const Room = require("./Model/Room");
const catalogRoutes  = require('./Routes/CatalogRoutes');
const Catalogo = require("./Model/Catalog");
const express = require('express');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

app.use(express.json());

const PORT = 3000;

//app.use(express.json());
app.use('/api/catalog', catalogRoutes);


app.get('/', (req, res) => {
  res.json({message : "Nothing here"})
});

app.post('/get', (req, res) => {
  console.log(req.body);
  res.json({"requestBody": "hello"})
});


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;