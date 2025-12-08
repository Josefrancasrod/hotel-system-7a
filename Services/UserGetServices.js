const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener todos los usuarios
const getAllUsers = async () => {
    try{
        const users = await prisma.users.findMany();
        return users;
    }catch(error){
        console.error(error);
        return { message: "Error al obtener usuarios." };
    }
}

// Obtener un usuario por ID
const getUserById = async (id) => {
    try{
        const user = await prisma.users.findUnique({
            where: { id: BigInt(id) }
        });

        if(!user) return { message: "Usuario no encontrado." };
        return user;

    }catch(error){
        console.error(error);
        return { message: "Error al obtener el usuario." };
    }
}

module.exports = { getAllUsers, getUserById };