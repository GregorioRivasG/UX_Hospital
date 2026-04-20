import express from "express";
import {
  assignRoomController,
  getPatientsInRoom,
  releaseRoomController,
  getAllOccupancyController
} from "../controllers/occupancyController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, assignRoomController);

router.get("/habitacion/:id", verifyToken, getPatientsInRoom);

router.get("/", verifyToken, getAllOccupancyController);

router.put("/liberar", verifyToken, releaseRoomController);

export default router;