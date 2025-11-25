// Services/UserServices.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// ==========================================
// CONFIGURACIÓN JWT
// ==========================================
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'secret_access_token_2024';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'secret_refresh_token_2024';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// Almacenamiento temporal de refresh tokens (en producción usar BD)
const refreshTokensMap = new Map();

// ==========================================
// FUNCIONES JWT
// ==========================================

const generateAccessToken = (payload) => {
  return jwt.sign(
    { userId: payload.userId, email: payload.email, role: payload.role, type: 'access' },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

const generateRefreshToken = (payload) => {
  const tokenId = Date.now().toString();
  const refreshToken = jwt.sign(
    { userId: payload.userId, email: payload.email, type: 'refresh', tokenId },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
  
  refreshTokensMap.set(tokenId, { userId: payload.userId, token: refreshToken });
  return refreshToken;
};

const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
  if (decoded.type !== 'access') throw new Error('Token inválido');
  return decoded;
};

const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
  if (decoded.type !== 'refresh') throw new Error('Token inválido');
  
  const stored = refreshTokensMap.get(decoded.tokenId);
  if (!stored || stored.token !== token) throw new Error('Refresh token revocado');
  
  return decoded;
};

const refreshAccessToken = (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  const newAccessToken = generateAccessToken({ 
    userId: decoded.userId, 
    email: decoded.email 
  });
  const newRefreshToken = generateRefreshToken({ 
    userId: decoded.userId, 
    email: decoded.email 
  });
  
  revokeRefreshToken(refreshToken);
  
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const revokeRefreshToken = (token) => {
  const decoded = jwt.decode(token);
  if (decoded?.tokenId) refreshTokensMap.delete(decoded.tokenId);
};

// ==========================================
// SERVICIO DE REGISTRO
// ==========================================
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

// ==========================================
// SERVICIO DE LOGIN (CON JWT MEJORADO)
// ==========================================
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

  // Generar tokens JWT (Access + Refresh)
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email
  });

  // No devolver la contraseña en la respuesta
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: ACCESS_TOKEN_EXPIRY
  };
};

// ==========================================
// SERVICIO DE LOGOUT
// ==========================================
const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token no proporcionado");
  }

  try {
    // Revocar el refresh token
    revokeRefreshToken(refreshToken);
    
    return { 
      message: "Sesión cerrada exitosamente",
      status: "success" 
    };
  } catch (error) {
    throw new Error("Error al cerrar sesión: " + error.message);
  }
};

// ==========================================
// EXPORTAR FUNCIONES
// ==========================================
module.exports = { 
  // Funciones de autenticación
  registerUser, 
  loginUser,
  logoutUser,
  
  // Funciones JWT
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  refreshAccessToken,
  revokeRefreshToken
};