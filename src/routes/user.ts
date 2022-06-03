import { Router } from "express";
import { searchUserController } from "../controller/user";
import { userMiddleware } from "../middleware/user";

const router = Router();


router.get('/search', userMiddleware, searchUserController);

export default router;