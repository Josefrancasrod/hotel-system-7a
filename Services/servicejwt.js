// Services/UserService.js
const jwt = require('jsonwebtoken');

class UserService {
  constructor() {
    this.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'secret_access_token_2024';
    this.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'secret_refresh_token_2024';
    this.ACCESS_TOKEN_EXPIRY = '15m';
    this.REFRESH_TOKEN_EXPIRY = '7d';
    this.refreshTokens = new Map();
  }

  generateAccessToken(payload) {
    return jwt.sign(
      { userId: payload.userId, email: payload.email, role: payload.role, type: 'access' },
      this.ACCESS_TOKEN_SECRET,
      { expiresIn: this.ACCESS_TOKEN_EXPIRY }
    );
  }

  generateRefreshToken(payload) {
    const tokenId = Date.now().toString();
    const refreshToken = jwt.sign(
      { userId: payload.userId, email: payload.email, type: 'refresh', tokenId },
      this.REFRESH_TOKEN_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRY }
    );
    
    this.refreshTokens.set(tokenId, { userId: payload.userId, token: refreshToken });
    return refreshToken;
  }

  verifyAccessToken(token) {
    const decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET);
    if (decoded.type !== 'access') throw new Error('Token inválido');
    return decoded;
  }

  verifyRefreshToken(token) {
    const decoded = jwt.verify(token, this.REFRESH_TOKEN_SECRET);
    if (decoded.type !== 'refresh') throw new Error('Token inválido');
    
    const stored = this.refreshTokens.get(decoded.tokenId);
    if (!stored || stored.token !== token) throw new Error('Refresh token revocado');
    
    return decoded;
  }

  refreshAccessToken(refreshToken) {
    const decoded = this.verifyRefreshToken(refreshToken);
    const newAccessToken = this.generateAccessToken({ userId: decoded.userId, email: decoded.email });
    const newRefreshToken = this.generateRefreshToken({ userId: decoded.userId, email: decoded.email });
    
    this.revokeRefreshToken(refreshToken);
    
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  revokeRefreshToken(token) {
    const decoded = jwt.decode(token);
    if (decoded?.tokenId) this.refreshTokens.delete(decoded.tokenId);
  }

  login(credentials) {
    const { email, password } = credentials;
    if (!email || !password) throw new Error('Credenciales incompletas');
    
    const user = { userId: '123', email, role: 'user' };
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
      user
    };
  }

  logout(refreshToken) {
    this.revokeRefreshToken(refreshToken);
    return { message: 'Logout exitoso' };
  }
}

module.exports = UserService;