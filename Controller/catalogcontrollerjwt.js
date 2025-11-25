// Controller/CatalogController.js
const UserService = require('../Services/UserServices'); // Nota: con "s" según tu estructura

class CatalogController {
  constructor() {
    this.userService = new UserService();
  }

  // POST /api/auth/refresh_token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new Error('Refresh token requerido');
      
      const result = this.userService.refreshAccessToken(refreshToken);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(401).json({ success: false, error: error.message });
    }
  }

  // POST /api/auth/logout
  async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      const result = this.userService.logout(refreshToken);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // GET /api/auth/verify
  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Token no proporcionado');
      
      const decoded = this.userService.verifyAccessToken(token);
      res.status(200).json({ success: true, data: decoded });
    } catch (error) {
      res.status(401).json({ success: false, error: error.message });
    }
  }
}

module.exports = CatalogController;