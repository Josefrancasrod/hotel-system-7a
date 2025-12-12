const prisma = require("../prisma/prismaClient");

module.exports = {

    // CREATE
    createRole: async (req, res) => {
        try {
            const { name, description } = req.body;
            const role = await prisma.role.create({
                data: { name, description }
            });
            res.json(role);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // READ (All)
    getRoles: async (req, res) => {
        try {
            const roles = await prisma.role.findMany();
            res.json(roles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // READ (One)
    getRoleById: async (req, res) => {
        try {
            const { id } = req.params;
            const role = await prisma.role.findUnique({
                where: { id: Number(id) }
            });
            res.json(role);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // UPDATE
    updateRole: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            const role = await prisma.role.update({
                where: { id: Number(id) },
                data: { name, description }
            });

            res.json(role);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE
    deleteRole: async (req, res) => {
        try {
            const { id } = req.params;
            const role = await prisma.role.delete({
                where: { id: Number(id) }
            });
            res.json({ message: "Role deleted", role });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
