import { Router } from "express";
import { getPaymentInitController, paymentRedirectCheckout, validateOrderPayment } from "../controller/payment";
import { authMiddleware } from "../middleware/auth";
import { validatePayment } from "../validation/payment";

const router = Router();

router.get('/info', getPaymentInitController);

router.post('/checkout', authMiddleware, validatePayment, paymentRedirectCheckout);

router.get('/validate/:id', authMiddleware, validateOrderPayment);

export default router;