import express from "express";
import {
  getAllAppointments,
  getAppointment,
  createAppointmentController,
  updateAppointmentController,
  cancelAppointmentController
} from "../controllers/appointmentController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/citas", verifyToken, getAllAppointments);
router.get("/citas/:id", verifyToken, getAppointment);
router.post("/citas", verifyToken, createAppointmentController);
router.put("/citas/:id", verifyToken, updateAppointmentController);
router.delete("/citas/:id", verifyToken, cancelAppointmentController);

export default router;