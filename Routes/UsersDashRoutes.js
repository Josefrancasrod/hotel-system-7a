
const { getUsers } = require('../Controller/userController'); 


const { Router } = require('express');
const routes = Router();

routes.get('/getAllUsers', getUsers); 

module.exports = routes;