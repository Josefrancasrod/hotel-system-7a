const { getRooms, getFilteredRooms} = require('../Controller/CatalogController')
const { Router } = require('express');
const routes = Router();

routes.get('/getAllTheRooms', getRooms);
routes.get('/getFilteredRooms', getFilteredRooms)

module.exports = routes;
