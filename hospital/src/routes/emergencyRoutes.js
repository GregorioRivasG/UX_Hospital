import express from "express";
import {
  getAllEmergencias,
  getEmergencia,
  createEmergenciaController,
  updateEmergenciaController,
  closeEmergenciaController
} from "../controllers/emergencyController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/emergencias", verifyToken, getAllEmergencias);

router.get("/emergencias/:id", verifyToken, getEmergencia);

router.post("/emergencias", verifyToken, createEmergenciaController);

router.put("/emergencias/:id", verifyToken, updateEmergenciaController);

router.delete("/emergencias/:id", verifyToken, closeEmergenciaController);

export default router;