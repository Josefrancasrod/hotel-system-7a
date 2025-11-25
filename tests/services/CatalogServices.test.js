BigInt.prototype.toJSON = function () {
  return this.toString();
};

const { getAllTheRooms } = require("../../Services/CatalogServices");

const listOfData = [
  {
    "id": "1",
    "name": "Habitación Estándar",
    "type": "Estándar",
    "price": 850,
    "description": "Cómoda habitación con cama matrimonial, aire acondicionado y baño privado.",
    "id_rating": "1"
  },
  {
    "id": "2",
    "name": "Suite Ejecutiva",
    "type": "Suite",
    "price": 1800,
    "description": "Espaciosa suite con sala de estar, escritorio, minibar y vista a la ciudad.",
    "id_rating": "2"
  },
  {
    "id": "3",
    "name": "Habitación Doble",
    "type": "Doble",
    "price": 950,
    "description": "Dos camas individuales, TV por cable y baño compartido.",
    "id_rating": "3"
  },
  {
    "id": "5",
    "name": "Habitación Familiar",
    "type": "Familiar",
    "price": 1500,
    "description": "Amplia habitación con 2 camas matrimoniales, ideal para familias de 4 personas.",
    "id_rating": "5"
  }
];

test('Llamo a la BD y obtengo una lista de cuartos',async () => {
    const data = await getAllTheRooms();
  expect(JSON.stringify(data)).toBe(JSON.stringify(listOfData));
});