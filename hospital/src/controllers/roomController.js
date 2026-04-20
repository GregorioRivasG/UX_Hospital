import * as Room from "../models/roomModel.js";

export const getAllRooms = async (req, res) => {
  try {
    const data = await Room.getRooms();
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createRoom = async (req, res) => {
  try {
    const { numero, tipo, capacidad } = req.body;

    const exists = await Room.findRoomByNumber(numero);
    if (exists.length > 0) {
      return res.status(400).json({
        message: "El número de habitación ya existe"
      });
    }

    if (capacidad <= 0) {
      return res.status(400).json({
        message: "La capacidad debe ser mayor a 0"
      });
    }

    await Room.createRoom(req.body);

    res.json({ message: "Habitación creada" });

  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { capacidad } = req.body;
    const id = req.params.id;

    if (capacidad <= 0) {
      return res.status(400).json({
        message: "Capacidad inválida"
      });
    }

    await Room.updateRoom(id, req.body);

    res.json({ message: "Habitación actualizada" });

  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const id = req.params.id;

    if (await Room.isRoomOccupied(id)) {
      return res.status(400).json({
        message: "No puedes eliminar una habitación ocupada"
      });
    }

    await Room.deleteRoom(id);

    res.json({ message: "Habitación dada de baja" });

  } catch (err) {
    res.status(500).json(err);
  }
};

export const searchRooms = async (req, res) => {
  try {
    const { numero } = req.query;

    if (!numero || numero.trim() === "") {
      return res.json([]); // 👈 importante
    }

    const data = await Room.searchRoomsByNumber(numero);

    res.json(data);

  } catch (err) {
    res.status(500).json(err);
  }
};