import * as Emerg from "../models/emergencyModel.js";
import { db } from "../config/db.js";

// 📋 obtener todas con búsqueda
export const getAllEmergencias = async (req, res) => {
  try {
    const search = req.query.search || "";
    const data = await Emerg.getAllEmergencias(search);
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

// 🔍 obtener una
export const getEmergencia = async (req, res) => {
  try {
    const data = await Emerg.getEmergencia(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

//crear
export const createEmergenciaController = async (req, res) => {
  try {
    await Emerg.createEmergencia(req.body);
    res.json({ message: "Emergencia registrada" });
  } catch (err) {
    res.status(500).json(err);
  }
};

//actualizar
export const updateEmergenciaController = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      nombre_paciente,
      paciente_id,
      condicion,
      prioridad,
      estatus,
      medico_id
    } = req.body;

    const emergencia = await Emerg.getEmergencia(id);

    if (!emergencia) {
      return res.status(404).json({
        message: "Emergencia no encontrada"
      });
    }


    if (medico_id) {
      const [medico] = await db.query(
        "SELECT id FROM medicos WHERE id=?",
        [medico_id]
      );

      if (medico.length === 0) {
        return res.status(400).json({
          message: "El médico no existe"
        });
      }
    }


    if (paciente_id) {
      const [paciente] = await db.query(
        "SELECT id FROM pacientes WHERE id=?",
        [paciente_id]
      );

      if (paciente.length === 0) {
        return res.status(400).json({
          message: "El paciente no existe"
        });
      }
    }

    const prioridadesValidas = ["baja", "media", "alta", "critica"];
    if (prioridad && !prioridadesValidas.includes(prioridad)) {
      return res.status(400).json({
        message: "Prioridad inválida"
      });
    }

    const estatusValidos = ["espera", "atendiendo", "estabilizado", "trasladado", "alta"];
    if (estatus && !estatusValidos.includes(estatus)) {
      return res.status(400).json({
        message: "Estatus inválido"
      });
    }

    if (!nombre_paciente || !condicion) {
      return res.status(400).json({
        message: "Faltan datos obligatorios"
      });
    }

    await Emerg.updateEmergencia(id, req.body);

    res.json({ message: "Emergencia actualizada correctamente" });

  } catch (err) {
    console.log("ERROR UPDATE:", err);
    res.status(500).json({
      message: "Error interno",
      error: err.message
    });
  }
};

export const closeEmergenciaController = async (req, res) => {
  try {
    await Emerg.closeEmergencia(req.params.id);
    res.json({ message: "Emergencia finalizada (alta)" });
  } catch (err) {
    res.status(500).json(err);
  }
};

