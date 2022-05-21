import { Router } from "express";
import { createCollectionController, getCollectionController } from "../controller/collections";
import { authMiddleware } from "../middleware/auth";
import { validateUserByRole } from "../middleware/validate-user";
import { createCollectionValidate } from "../validation/collections";

const router = Router();

router.get('/get', getCollectionController);

router.post('/create', authMiddleware, createCollectionValidate, validateUserByRole,  createCollectionController);

export default router;