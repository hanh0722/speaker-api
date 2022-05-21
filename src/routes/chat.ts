import { Router } from "express";
import { chatController } from "../controller/chat";

const router = Router();

router.post("/chat", chatController);

export default router;
