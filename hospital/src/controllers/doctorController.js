import { getDoctors, getDoctorById, createDoctor, updateDoctor, deactivateDoctor } from "../models/doctorModel.js";

export const getAllDoctors = async (req, res) => {
  try {
    const search = req.query.search || "";
    const doctors = await getDoctors(search);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDoctor = async (req, res) => {
  try {
    const doctor = await getDoctorById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Médico no encontrado" });
    }

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDoctorController = async (req, res) => {
  try {
    await createDoctor(req.body);
    res.json({ message: "Médico creado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDoctorController = async (req, res) => {
  try {
    await updateDoctor(req.params.id, req.body);
    res.json({ message: "Médico actualizado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deactivateDoctorController = async (req, res) => {
  try {
    await deactivateDoctor(req.params.id);
    res.json({ message: "Médico dado de baja" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};