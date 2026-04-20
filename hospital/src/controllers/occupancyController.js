import * as Occ from "../models/occupancyModel.js";

export const assignRoomController = async (req, res) => {
  try {
    const { habitacion_id, paciente_id } = req.body;

    if (!habitacion_id || !paciente_id) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const room = await Occ.getRoom(habitacion_id);

    if (!room || room.activo === 0) {
      return res.status(400).json({
        message: "Habitación no disponible"
      });
    }

    if (room.estatus === "mantenimiento") {
      return res.status(400).json({
        message: "Habitación en mantenimiento"
      });
    }

    if (await Occ.isPatientInRoom(habitacion_id, paciente_id)) {
      return res.status(400).json({
        message: "Paciente ya está en esta habitación"
      });
    }

    const total = await Occ.countPatients(habitacion_id);

    if (total >= room.capacidad) {
      return res.status(400).json({
        message: "Habitación llena"
      });
    }

    await Occ.assignRoom(habitacion_id, paciente_id);
    await Occ.updateRoomStatus(habitacion_id);

    res.json({ message: "Paciente asignado correctamente" });

  } catch (err) {
    res.status(500).json(err);
  }
};

export const releaseRoomController = async (req, res) => {
  try {
    const { habitacion_id, paciente_id } = req.body;

    if (!habitacion_id || !paciente_id) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    await Occ.releaseByPatient(habitacion_id, paciente_id);
    await Occ.updateRoomStatus(habitacion_id);

    res.json({ message: "Paciente dado de alta" });

  } catch (err) {
    res.status(500).json(err);
  }
};

export const getPatientsInRoom = async (req, res) => {
  try {
    const data = await Occ.getPatientsInRoom(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getAllOccupancyController = async (req, res) => {
  try {
    const data = await Occ.getAllOccupancy();
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};