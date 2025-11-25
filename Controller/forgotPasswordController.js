const { 
  requestPasswordReset, 
  resetPassword 
} = require("../Services/PasswordResetServices");

// ==================== SOLICITAR RECUPERACIÓN DE CONTRASEÑA ====================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validación de campo obligatorio
    if (!email) {
      return res.status(400).json({ 
        message: "El email es obligatorio" 
      });
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Formato de email inválido" 
      });
    }

    // Solicitar token de recuperación
    const result = await requestPasswordReset(email.trim().toLowerCase());

    return res.status(200).json({
      message: "Si el email existe, se enviará un código de recuperación",
      // Solo para desarrollo/testing - ELIMINAR EN PRODUCCIÓN
      resetToken: result.resetToken,
      expiresAt: result.expiresAt
    });
  } catch (error) {
    console.error("Error al solicitar recuperación de contraseña:", error.message);
    
    // Por seguridad, siempre devolver el mismo mensaje
    return res.status(200).json({
      message: "Si el email existe, se enviará un código de recuperación",
    });
  }
};

// ==================== RESTABLECER CONTRASEÑA ====================
const resetPasswordController = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    // Validación de campos obligatorios
    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({ 
        message: "Email, token y nueva contraseña son obligatorios" 
      });
    }

    // Validar longitud mínima de contraseña
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "La contraseña debe tener al menos 6 caracteres" 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Formato de email inválido" 
      });
    }

    // Restablecer la contraseña
    await resetPassword({
      email: email.trim().toLowerCase(),
      resetToken: resetToken.trim().toUpperCase(),
      newPassword,
    });

    return res.status(200).json({
      message: "Contraseña restablecida correctamente",
    });
  } catch (error) {
    console.error("Error al restablecer contraseña:", error.message);
    return res.status(400).json({
      message: error.message || "Error al restablecer la contraseña",
    });
  }
};

module.exports = { 
  forgotPassword, 
  resetPasswordController 
};