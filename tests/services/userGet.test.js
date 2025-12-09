BigInt.prototype.toJSON = function () {
  return this.toString();
};

const { getAllUsers } = require("../../Services/UserGetServices");

const listOfData = [
  {
    "id": "1",
    "nombre": "Juan",
    "apellidos": "Pérez López",
    "email": "juan@example.com",
    "username": "juanp",
    "cell_number": "5551234567",
    "password": "123456",
    "role": "user",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": "2",
    "nombre": "María",
    "apellidos": "García Torres",
    "email": "maria@example.com",
    "username": "mariagt",
    "cell_number": null,
    "password": "abcdef",
    "role": "admin",
    "created_at": "2025-01-02T00:00:00.000Z",
    "updated_at": "2025-01-02T00:00:00.000Z"
  }
];

test('Llamo a la BD y obtengo una lista de usuarios', async () => {
  const data = await getAllUsers();
  expect(JSON.stringify(data)).toBe(JSON.stringify(listOfData));
});
