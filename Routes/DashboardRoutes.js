const express = require('express');
const router = express.Router();
const dashboardController = require('../Controller/DashboardController');

// Ruta: /api/dashboard/metrics
router.get('/metrics', dashboardController.getClientsByMonth);

module.exports = router;