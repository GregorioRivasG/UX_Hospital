import express from "express";
import {
  getAllPatients,
  getPatient,
  createPatientController,
  updatePatientController,
  deactivatePatientController
} from "../controllers/patientController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

//rutas protegidas
router.get("/pacientes", verifyToken, getAllPatients);
router.get("/pacientes/:id", verifyToken, getPatient);
router.post("/pacientes", verifyToken, createPatientController);
router.put("/pacientes/:id", verifyToken, updatePatientController);
router.delete("/pacientes/:id", verifyToken, deactivatePatientController);

export default router;