const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const prisma = new PrismaClient();

// ==================== SOLICITAR RECUPERACIÓN DE CONTRASEÑA ====================
const requestPasswordReset = async (email) => {
  // Buscar usuario por email
  const user = await prisma.users.findUnique({
    where: { email }
  });

  if (!user) {
    // Por seguridad, no revelar si el email existe o no
    throw new Error("Usuario no encontrado");
  }

  // Generar token aleatorio de 6 caracteres
  const resetToken = crypto.randomBytes(3).toString("hex").toUpperCase();
  
  // Calcular fecha de expiración (15 minutos desde ahora)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);

  // Guardar token en la base de datos
  await prisma.users.update({
    where: { email },
    data: {
      reset_token: resetToken,
      reset_token_expires: expiresAt,
      updated_at: new Date()
    }
  });

  console.log(`Token de recuperación para ${email}: ${resetToken}`);
  console.log(`Expira en: ${expiresAt}`);
  
  // TODO: Enviar email con el token
  // Ejemplo: await sendResetEmail(email, resetToken);
  
  return {
    email: user.email,
    resetToken, // Solo para desarrollo, eliminar en producción
    expiresAt
  };
};

// ==================== RESTABLECER CONTRASEÑA ====================
const resetPassword = async ({ email, resetToken, newPassword }) => {
  // Buscar usuario por email
  const user = await prisma.users.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("Email o token inválido");
  }

  // Verificar que el token existe
  if (!user.reset_token || !user.reset_token_expires) {
    throw new Error("No hay solicitud de recuperación de contraseña activa");
  }

  // Verificar que el token coincide
  if (user.reset_token !== resetToken) {
    throw new Error("Token inválido");
  }

  // Verificar que el token no ha expirado
  const now = new Date();
  if (now > user.reset_token_expires) {
    throw new Error("El token ha expirado. Solicita uno nuevo");
  }

  // Hashear la nueva contraseña
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Actualizar contraseña y limpiar token
  await prisma.users.update({
    where: { email },
    data: { 
      password: hashedPassword,
      reset_token: null,
      reset_token_expires: null,
      updated_at: new Date()
    }
  });

  return { message: "Contraseña actualizada correctamente" };
};

// ==================== VERIFICAR SI UN TOKEN ES VÁLIDO ====================
const verifyResetToken = async (email, resetToken) => {
  const user = await prisma.users.findUnique({
    where: { email }
  });

  if (!user || !user.reset_token || !user.reset_token_expires) {
    return false;
  }

  if (user.reset_token !== resetToken) {
    return false;
  }

  const now = new Date();
  if (now > user.reset_token_expires) {
    return false;
  }

  return true;
};

module.exports = { 
  requestPasswordReset, 
  resetPassword,
  verifyResetToken
};