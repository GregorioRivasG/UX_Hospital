import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getDoctorSchedule
} from "../models/appointmentModel.js";

//listar
export const getAllAppointments = async (req, res) => {
  try {
    const filters = {
      paciente: req.query.paciente,
      medico: req.query.medico,
      fecha: req.query.fecha,
      hora_inicio: req.query.hora_inicio,
      hora_fin: req.query.hora_fin
    };

    const data = await getAppointments(filters);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//una
export const getAppointment = async (req, res) => {
  try {
    const data = await getAppointmentById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//crear con validación de horario
export const createAppointmentController = async (req, res) => {
  try {
    const { medico_id, hora } = req.body;

    const doctor = await getDoctorSchedule(medico_id);

    if (!doctor) {
      return res.status(404).json({ message: "Médico no encontrado" });
    }

    if (hora < doctor.horario_entrada || hora > doctor.horario_salida) {
      return res.status(400).json({
        message: "La cita está fuera del horario del médico"
      });
    }

    await createAppointment(req.body);

    res.json({ message: "Cita creada" });

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "El médico ya tiene una cita en ese horario"
      });
    }

    res.status(500).json({ error: err.message });
  }
};

//actualizar con validación
export const updateAppointmentController = async (req, res) => {
  try {
    const { medico_id, hora } = req.body;

    const doctor = await getDoctorSchedule(medico_id);

    if (!doctor) {
      return res.status(404).json({ message: "Médico no encontrado" });
    }

    if (hora < doctor.horario_entrada || hora > doctor.horario_salida) {
      return res.status(400).json({
        message: "La cita está fuera del horario del médico"
      });
    }

    await updateAppointment(req.params.id, req.body);

    res.json({ message: "Cita actualizada" });

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "El médico ya tiene una cita en ese horario"
      });
    }

    res.status(500).json({ error: err.message });
  }
};

//cancelar
export const cancelAppointmentController = async (req, res) => {
  try {
    await cancelAppointment(req.params.id);
    res.json({ message: "Cita cancelada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};