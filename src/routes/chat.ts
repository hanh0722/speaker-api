import { Router } from "express";
import { chatController } from "../controller/chat";
import { authMiddleware } from "../middleware/auth";
import { ChatValidation } from "../validation/chat";

const router = Router();

router.post("/create", authMiddleware, ChatValidation, chatController);

export default router;
