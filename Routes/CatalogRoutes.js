const { getAllTheRooms, getFilteredRooms} = require('../Controller/CatalogController')
const { Router } = require('express');
const routes = Router();

routes.get('/getAllTheRooms', getAllTheRooms);
routes.get('/getFilteredRooms', getFilteredRooms)

module.exports = routes;
