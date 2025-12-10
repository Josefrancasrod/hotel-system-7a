const express = require('express');
const router = express.Router();

const { getMonthlyRevenue } = require('../Controller/MonthlyRevenueController');

router.get('/getMonthlyRevenue', getMonthlyRevenue);

module.exports = router;