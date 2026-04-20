import express from "express";
import { getAllUsers, updateUserController, deactivateUserController } from "../controllers/userController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/usuarios", verifyToken, getAllUsers);
router.put("/usuarios/:id", verifyToken, updateUserController);
router.delete("/usuarios/:id", verifyToken, deactivateUserController);

export default router;