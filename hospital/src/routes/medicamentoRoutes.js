import express from "express";
import {
  getAllMedicamentos,
  getMedicamento,
  createMedicamentoController,
  updateMedicamentoController,
  deactivateMedicamentoController,
  getLowStockMedicamentos
} from "../controllers/medicamentoController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/medicamentos", verifyToken, getAllMedicamentos);
router.get("/medicamentos/low", verifyToken, getLowStockMedicamentos);
router.get("/medicamentos/:id", verifyToken, getMedicamento);
router.post("/medicamentos", verifyToken, createMedicamentoController);
router.put("/medicamentos/:id", verifyToken, updateMedicamentoController);
router.delete("/medicamentos/:id", verifyToken, deactivateMedicamentoController);

export default router;