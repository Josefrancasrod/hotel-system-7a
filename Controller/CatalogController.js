const { response } = require("express");
const { getAllTheRooms, createRoom, deleteRoom, updateRoom } = require("../Services/CatalogServices")


const getRooms = async (req, res) => {
    console.log(req.body);
    
    const rooms = await getAllTheRooms();
    console.log(rooms)

    res.json(rooms)

}
const getFilteredRooms = (req, res) => {
    //Add Query to Filtered Rooms
    console.log("Get Filtered Rooms");
}

const createRooms = async (req, res) => {
    const room = await createRoom(req.body);

    res.json({
        message: "Room creado correctamente",
        body: room
    });
}
const editRooms = (req, res) => {

}
const deleteRooms = async (req, res) => {
    
    const room = await deleteRoom(req.body);
    res.json(room);
}

const updateRooms = async (req, res) => {
    
    const room = await updateRoom(req.body.id, req.body);
    res.json(room);
}

module.exports = {getRooms, getFilteredRooms, updateRooms, deleteRooms, createRooms}

