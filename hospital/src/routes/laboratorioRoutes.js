import express from "express";
import {
  getAllLaboratorios,
  getLaboratorio,
  createLaboratorioController,
  updateLaboratorioController,
  deleteLaboratorioController
} from "../controllers/laboratorioController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/laboratorio", verifyToken, getAllLaboratorios);
router.get("/laboratorio/:id", verifyToken, getLaboratorio);
router.post("/laboratorio", verifyToken, createLaboratorioController);
router.put("/laboratorio/:id", verifyToken, updateLaboratorioController);
router.delete("/laboratorio/:id", verifyToken, deleteLaboratorioController);

export default router;