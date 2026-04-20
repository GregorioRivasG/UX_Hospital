import * as Mat from "../models/materialModel.js";

export const getAllMateriales = async (req, res) => {
  try {
    const data = await Mat.getAllMateriales();
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createMaterialController = async (req, res) => {
  try {
    await Mat.createMaterial(req.body);
    res.json({ message: "Material creado" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateMaterialController = async (req, res) => {
  try {
    await Mat.updateMaterial(req.params.id, req.body);
    res.json({ message: "Material actualizado" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deactivateMaterialController = async (req, res) => {
  try {
    await Mat.deactivateMaterial(req.params.id);
    res.json({ message: "Material dado de baja" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getLowStockMateriales = async (req, res) => {
  try {
    const data = await Mat.getLowStockMateriales();
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};