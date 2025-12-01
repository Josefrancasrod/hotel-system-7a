//1. Parche para BigInt (CRUCIAL para PostgreSQL 'id's)
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// 2. Importar el servicio
// RUTA FINAL CORREGIDA (minúsculas y sin .test.js)
const { getAllUsers } = require("../../services/UserServices.js");

// 3. Datos esperados (Tabla vacía)
const expectedUsers = [];

// 4. El Test
test('Llamo a la BD y obtengo una lista de usuarios (Tabla vacía)', async () => {
  const data = await getAllUsers();
  
  // Compara el resultado (JSON) con lo esperado (JSON vacío)
  expect(JSON.stringify(data)).toBe(JSON.stringify(expectedUsers));
});