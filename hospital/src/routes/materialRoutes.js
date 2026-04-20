import express from "express";
import {
  getAllMateriales,
  createMaterialController,
  updateMaterialController,
  deactivateMaterialController,
  getLowStockMateriales
} from "../controllers/materialController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/materiales", verifyToken, getAllMateriales);
router.get("/materiales/low", verifyToken, getLowStockMateriales);
router.post("/materiales", verifyToken, createMaterialController);
router.put("/materiales/:id", verifyToken, updateMaterialController);
router.delete("/materiales/:id", verifyToken, deactivateMaterialController);

export default router;