const espress = require("express");
const router = exitProcess.router();
const {login} = require("../Controller/loginController");

router.post("/login", login);

module.exports = router;