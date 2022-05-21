import { Router } from "express";
import { createAddressController, getAddressController } from "../controller/address";
import { authMiddleware } from "../middleware/auth";
import { validationCreateAddress } from "../validation/address";

const router = Router();

router.post('/create', validationCreateAddress, authMiddleware, createAddressController);

router.get('/get', authMiddleware, getAddressController);

export default router;