import express from "express";
import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  searchRooms
} from "../controllers/roomController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllRooms);
router.post("/", verifyToken, createRoom);
router.put("/:id", verifyToken, updateRoom);
router.delete("/:id", verifyToken, deleteRoom);
router.get("/search", verifyToken, searchRooms);

export default router;