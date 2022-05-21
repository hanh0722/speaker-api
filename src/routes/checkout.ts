import { Router } from "express";
import { onCheckoutController, onDeleteOrderErrorController } from "../controller/checkout";
import { authMiddleware } from "../middleware/auth";
import { validationDeleteOrder, validationOrder } from "../validation/order";

const router = Router();

router.post('/create', validationOrder, authMiddleware, onCheckoutController);

router.delete('/delete/:redirect_id', validationDeleteOrder, authMiddleware, onDeleteOrderErrorController);

export default router;