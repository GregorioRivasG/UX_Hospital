import express from "express";
import { getAllDoctors, getDoctor, createDoctorController, updateDoctorController, deactivateDoctorController } from "../controllers/doctorController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/medicos", verifyToken, getAllDoctors);
router.get("/medicos/:id", verifyToken, getDoctor);
router.post("/medicos", verifyToken, createDoctorController);
router.put("/medicos/:id", verifyToken, updateDoctorController);
router.delete("/medicos/:id", verifyToken, deactivateDoctorController);

console.log("Doctor routes cargadas");
export default router;