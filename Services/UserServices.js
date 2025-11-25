const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // <-- IMPORTANTE: lo agregamos

const prisma = new PrismaClient();

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

// Servicio para login
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
      role: user.role,
    },
    process.env.JWT_SECRET || "tu_secreto_jwt",
    { expiresIn: "24h" }
  );

  // No devolver la contraseña
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

// Servicio para cerrar sesión
const logoutUser = async (userId) => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return { userId, status: "Sesión cerrada" };
};

module.exports = { 
  registerUser,
  loginUser,    // <-- IMPORTANTE: ahora sí está exportado
  logoutUser 
};
