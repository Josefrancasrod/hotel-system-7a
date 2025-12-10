const dashboardServices = require('../Services/DashboardServices');

const getClientsByMonth = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: 'Faltan parámetros: month y year' });
    }

    const data = await dashboardServices.getUsersByMonth(parseInt(month), parseInt(year));

    res.status(200).json({
      success: true,
      count: data.length,
      month: month,
      year: year,
      data: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getClientsByMonth };