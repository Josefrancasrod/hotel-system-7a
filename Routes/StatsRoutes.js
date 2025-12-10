const express = require('express');
const router = express.Router();

const { getAverageStay } = require('../Controller/AverageStayController');

router.get('/getAverageStay', getAverageStay);

module.exports = router;