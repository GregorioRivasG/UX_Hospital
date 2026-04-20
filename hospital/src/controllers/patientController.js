import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deactivatePatient
} from "../models/patientModel.js";

export const getAllPatients = async (req, res) => {
  try {
    const search = req.query.search || "";
    const patients = await getPatients(search);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPatient = async (req, res) => {
  try {
    const patient = await getPatientById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPatientController = async (req, res) => {
  try {
    await createPatient(req.body);
    res.json({ message: "Paciente creado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePatientController = async (req, res) => {
  try {
    await updatePatient(req.params.id, req.body);
    res.json({ message: "Paciente actualizado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deactivatePatientController = async (req, res) => {
  try {
    await deactivatePatient(req.params.id);
    res.json({ message: "Paciente dado de baja" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};