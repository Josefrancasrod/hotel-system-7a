//1.-Crear usuario (POST /usuarios)
fetch("/usuarios", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    nombre: "Carlos López",
    correo: "carlos@hotel.com",
    contrasena: "123456",
    rol: "recepcionista"
  })
})
.then(res => res.json())
.then(console.log);
//correo ya existe
fetch("/usuarios", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    nombre: "Carlos López",
    correo: "carlos@hotel.com",
    contrasena: "abc123",
    rol: "recepcionista"
  })
})
.then(res => res.json())
.then(console.log);

//Prueba 3 – Campos incompletos
fetch("/usuarios", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ correo: "nuevo@hotel.com" })
})
.then(res => res.json())
.then(console.log);

//2. Obtener lista de usuarios (GET /usuarios)
fetch("/usuarios")
  .then(res => res.json())
  .then(console.log);

//Prueba 2 – Búsqueda filtrada por rol
fetch("/usuarios?rol=recepcionista")
  .then(res => res.json())
  .then(console.log);
//Prueba 3 – Sin resultados
fetch("/usuarios?rol=gerente")
  .then(res => res.json())
  .then(console.log);

//3. Obtener usuario por ID (GET /usuarios/:id)
fetch("/usuarios/1")
  .then(res => res.json())
  .then(console.log);
//Prueba 2 – Usuario no existente
fetch("/usuarios/999")
  .then(res => res.json())
  .then(console.log);
//Prueba 3 – ID inválido
fetch("/usuarios/abc")
  .then(res => res.json())
  .then(console.log);
//4. Actualizar usuario (PUT /usuarios/:id)
fetch("/usuarios/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nombre: "Carlos L. López", rol: "administrador" })
})
.then(res => res.json())
.then(console.log);

//Prueba 2 – Usuario no encontrado
fetch("/usuarios/999", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nombre: "Prueba" })
})
.then(res => res.json())
.then(console.log);
//Prueba 3 – Datos inválidos
fetch("/usuarios/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ rol: "" })
})
.then(res => res.json())
.then(console.log);

//5. Eliminar usuario (DELETE /usuarios/:id)
fetch("/usuarios/1", { method: "DELETE" })
  .then(res => res.json())
  .then(console.log);

//Prueba 2 – Usuario no encontrado
fetch("/usuarios/999", { method: "DELETE" })
  .then(res => res.json())
  .then(console.log);
//Prueba 3 – ID inválido
fetch("/usuarios/abc", { method: "DELETE" })
  .then(res => res.json())
  .then(console.log);
