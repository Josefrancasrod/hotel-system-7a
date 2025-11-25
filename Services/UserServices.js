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

module.exports = { updateUser };
