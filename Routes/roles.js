const express = require("express");
const router = express.Router();
const {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole
} = require("../controllers/roles.controller");

// CRUD
router.post("/", createRole);       // CREATE
router.get("/", getRoles);          // READ all
router.get("/:id", getRoleById);    // READ one
router.put("/:id", updateRole);     // UPDATE
router.delete("/:id", deleteRole);  // DELETE

module.exports = router;
