import * as Lab from "../models/laboratorioModel.js";
import { db } from "../config/db.js";

//istar con filtros
export const getAllLaboratorios = async (req, res) => {
  try {
    const filters = {
      paciente: req.query.paciente,
      medico: req.query.medico,
      examen: req.query.examen,
      fecha: req.query.fecha
    };

    const data = await Lab.getAllLaboratorios(filters);
    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

//no
export const getLaboratorio = async (req, res) => {
  try {
    const data = await Lab.getLaboratorio(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "No encontrado" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

//crear
export const createLaboratorioController = async (req, res) => {
  try {
    const { paciente_id, medico_id } = req.body;

    //validar paciente
    const [paciente] = await db.query(
      "SELECT id FROM pacientes WHERE id=?",
      [paciente_id]
    );

    if (paciente.length === 0) {
      return res.status(400).json({ message: "Paciente no existe" });
    }

    //validar medico
    if (medico_id) {
      const [medico] = await db.query(
        "SELECT id FROM medicos WHERE id=?",
        [medico_id]
      );

      if (medico.length === 0) {
        return res.status(400).json({ message: "Medico no existe" });
      }
    }

    await Lab.createLaboratorio(req.body);

    res.json({ message: "Registro creado" });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

//actualizar
export const updateLaboratorioController = async (req, res) => {
  try {
    const { paciente_id, medico_id } = req.body;

    //validar paciente
    const [paciente] = await db.query(
      "SELECT id FROM pacientes WHERE id=?",
      [paciente_id]
    );

    if (paciente.length === 0) {
      return res.status(400).json({ message: "Paciente no existe" });
    }

    //validar medico
    if (medico_id) {
      const [medico] = await db.query(
        "SELECT id FROM medicos WHERE id=?",
        [medico_id]
      );

      if (medico.length === 0) {
        return res.status(400).json({ message: "Medico no existe" });
      }
    }

    await Lab.updateLaboratorio(req.params.id, req.body);

    res.json({ message: "Actualizado" });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

//cancelar
export const deleteLaboratorioController = async (req, res) => {
  try {
    await Lab.deleteLaboratorio(req.params.id);
    res.json({ message: "Cancelado" });
  } catch (err) {
    res.status(500).json(err);
  }
};