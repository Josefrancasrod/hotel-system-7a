const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllTheRooms = async () => {
    try{
        const rooms = await prisma.rooms.findMany();
        //const users = await prisma.usurios.findMany();
        return rooms;
    }catch(error){
        console.error(error);
        return {message: "Error al comunicarse a db."};
    }
}

const updateRoom = async (id, updatedRoom) => {
    try{
        const room = await prisma.rooms.update({
            where: { id },
            updatedRoom
        });
        return {message: "Se actualizo correctamente el cuarto.", updatedRoom: room}

    }catch(error){
        console.error(error);
        return {message: "Error al actualizar el cuarto."};
    }
}

const deleteRoom = async (id) => {
    try{
        const deletedRoom = await prisma.rooms.delete({
            where: { id }
        });
        return {message: "Cuarto borrado correctamente."}
    }catch(error){
        console.error(error);
        return {message: "Error al borrar el cuarto."};
    }
}

const createRoom = async (room) => {
    try{
        const createdRoom = await prisma.rooms.create(room);

        return createdRoom;

    }catch(error){
        console.error(error);
        return {message: "Error al crear el cuarto."};
    }
}

module.exports = { getAllTheRooms, createRoom, updateRoom, deleteRoom };