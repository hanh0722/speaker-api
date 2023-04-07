import { Router } from "express";
import { searchUserController, updateInfoUserController } from "../controller/user";
import { userMiddleware } from "../middleware/user";
import { validateUpdateInfo } from "../validation/user";

const router = Router();


router.get('/search', userMiddleware, searchUserController);

router.put('/update', userMiddleware, validateUpdateInfo, updateInfoUserController);

export default router;