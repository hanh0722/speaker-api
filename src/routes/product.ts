import { Router } from "express";
import { createProductController, getProductController } from "../controller/product";
import { authMiddleware } from "../middleware/auth";
import { validateUserByRole } from "../middleware/validate-user";
import { createProductValidation } from "../validation/product";

const router = Router();

router.post("/create", authMiddleware, createProductValidation, validateUserByRole, createProductController);

router.get('/get', getProductController);

export default router;
