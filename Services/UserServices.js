const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const updateUser = async (id, data) => {
  const user = await prisma.users.findUnique({
    where: { id: Number(id) }
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Si viene una contraseña nueva, la hasheamos
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const updatedUser = await prisma.users.update({
    where: { id: Number(id) },
    data
  });

  // Ocultamos la contraseña antes de devolver
  const { password: _, ...userWithoutPassword } = updatedUser;

  return userWithoutPassword;
};

// Servicio para registrar un usuario
const registerUser = async ({ nombre, apellidos, email, username, cell_number, password, role }) => {
  const existingUser = await prisma.users.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new Error("El email o username ya están registrados");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.users.create({
    data: {
      nombre,
      apellidos,
      email,
      username,
      cell_number,
      password: hashedPassword,
      role: role || "user",
    },
  });

  const { password: _, ...userWithoutPassword } = newUser;

  return userWithoutPassword;
};

const loginUser = async ({ email, password }) => {
  // Buscar usuario por email
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  // Verificar la contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Credenciales inválidas");
  }

  // Generar token JWT
  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || "tu_secreto_jwt", // Usa variable de entorno en producción
    { expiresIn: "24h" }
  );

  // No devolver la contraseña en la respuesta
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};


// Servicio para cerrar sesión
const logoutUser = async (userId) => {
  // Aquí se puede invalidar el token, limpiar sesión, o registrar un log.

  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Aquí podrías agregar lógica como:
  // await prisma.sessions.deleteMany({ where: { userId } });

  return { userId, status: "Sesión cerrada" };
};

module.exports = { registerUser, logoutUser, updateUser};
