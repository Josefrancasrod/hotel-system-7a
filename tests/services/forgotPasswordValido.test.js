const { 
  forgotPassword, 
  resetPasswordController 
} = require("../../Controller/forgotPasswordController");
const { 
  requestPasswordReset, 
  resetPassword 
} = require("../../Services/PasswordResetServices");

// Mock del servicio de recuperación de contraseña
jest.mock("../../Services/PasswordResetServices");

describe("Controlador: forgotPassword y resetPassword", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // ============ TESTS FORGOT PASSWORD ============
  describe("forgotPassword", () => {
    test("Debe solicitar recuperación de contraseña correctamente", async () => {
      req.body = { email: "fernando@example.com" };
      
      const mockResult = {
        email: "fernando@example.com",
        resetToken: "ABC123",
        expiresAt: new Date()
      };
      
      requestPasswordReset.mockResolvedValue(mockResult);

      await forgotPassword(req, res);

      expect(requestPasswordReset).toHaveBeenCalledWith("fernando@example.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Si el email existe, se enviará un código de recuperación",
        resetToken: "ABC123",
        expiresAt: mockResult.expiresAt
      });
    });

    test("Debe devolver error si falta el email", async () => {
      req.body = {};

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "El email es obligatorio",
      });
    });

    test("Debe validar formato de email", async () => {
      req.body = { email: "emailinvalido" };

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Formato de email inválido",
      });
    });

    test("Debe manejar errores sin revelar si el email existe", async () => {
      req.body = { email: "noexiste@example.com" };
      
      requestPasswordReset.mockRejectedValue(
        new Error("Usuario no encontrado")
      );

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Si el email existe, se enviará un código de recuperación",
      });
    });
  });

  // ============ TESTS RESET PASSWORD ============
  describe("resetPassword", () => {
    test("Debe restablecer contraseña correctamente", async () => {
      req.body = {
        email: "fernando@example.com",
        resetToken: "ABC123",
        newPassword: "newPassword123"
      };

      resetPassword.mockResolvedValue({
        message: "Contraseña actualizada correctamente"
      });

      await resetPasswordController(req, res);

      expect(resetPassword).toHaveBeenCalledWith({
        email: "fernando@example.com",
        resetToken: "ABC123",
        newPassword: "newPassword123",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Contraseña restablecida correctamente",
      });
    });

    test("Debe devolver error si faltan campos obligatorios", async () => {
      req.body = { email: "fernando@example.com" };

      await resetPasswordController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email, token y nueva contraseña son obligatorios",
      });
    });

    test("Debe validar longitud mínima de contraseña", async () => {
      req.body = {
        email: "fernando@example.com",
        resetToken: "ABC123",
        newPassword: "123"
      };

      await resetPasswordController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    });

    test("Debe validar formato de email", async () => {
      req.body = {
        email: "emailinvalido",
        resetToken: "ABC123",
        newPassword: "newPassword123"
      };

      await resetPasswordController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Formato de email inválido",
      });
    });

    test("Debe manejar errores de token inválido", async () => {
      req.body = {
        email: "fernando@example.com",
        resetToken: "INVALID",
        newPassword: "newPassword123"
      };

      resetPassword.mockRejectedValue(new Error("Token inválido"));

      await resetPasswordController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Token inválido",
      });
    });

    test("Debe manejar errores de token expirado", async () => {
      req.body = {
        email: "fernando@example.com",
        resetToken: "ABC123",
        newPassword: "newPassword123"
      };

      resetPassword.mockRejectedValue(
        new Error("El token ha expirado. Solicita uno nuevo")
      );

      await resetPasswordController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "El token ha expirado. Solicita uno nuevo",
      });
    });

    test("Debe manejar errores de email no encontrado", async () => {
      req.body = {
        email: "noexiste@example.com",
        resetToken: "ABC123",
        newPassword: "newPassword123"
      };

      resetPassword.mockRejectedValue(
        new Error("Email o token inválido")
      );

      await resetPasswordController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email o token inválido",
      });
    });
  });
});