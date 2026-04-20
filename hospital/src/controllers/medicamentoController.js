import * as Med from "../models/medicamentoModel.js";

export const getAllMedicamentos = async (req, res) => {
  try {
    const data = await Med.getAllMedicamentos();
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getMedicamento = async (req, res) => {
  try {
    const data = await Med.getMedicamento(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createMedicamentoController = async (req, res) => {
  try {
    await Med.createMedicamento(req.body);
    res.json({ message: "Medicamento creado" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateMedicamentoController = async (req, res) => {
  try {
    await Med.updateMedicamento(req.params.id, req.body);
    res.json({ message: "Medicamento actualizado" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deactivateMedicamentoController = async (req, res) => {
  try {
    await Med.deactivateMedicamento(req.params.id);
    res.json({ message: "Medicamento dado de baja" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getLowStockMedicamentos = async (req, res) => {
  try {
    const data = await Med.getLowStockMedicamentos();
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};