const Room = require("./Model/Room");
const catalogRoutes  = require('./Routes/CatalogRoutes');
const Catalogo = require("./Model/Catalog");
const express = require('express');

const app = express();

app.use(express.json());

const PORT = 3000;

//app.use(express.json());
app.use('/api/catalogRoutes', catalogRoutes);


app.get('/', (req, res) => {
  var room = new Room("Deluxe", "Luxury",5000, "image_url");
  var room2 = new Room("Deluxe1", "Luxury1",6000,"image_url");
  var room3 = new Room("Deluxe2", "Luxury2",7000,"image_url");

  var catalog = new Catalogo([room, room2, room3]);

  res.json(catalog);
});

app.post('/get', (req, res) => {
  console.log(req.body);
  res.json({"requestBody": "hello"})
});

app.get('/get', (req, res) => {
  res.send('Hello!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;