const jwt = require("jsonwebtoken"); // Asegúrate de instalar: npm install jsonwebtoken

// Agregar esta función al archivo UserServices.js existente
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

// Actualizar el module.exports para incluir loginUser
module.exports = { registerUser, loginUser };