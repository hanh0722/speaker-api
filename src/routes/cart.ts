import { Router } from "express";
import { addCartController, deleteCartController, getCartController } from "../controller/cart";
import { authMiddleware } from "../middleware/auth";
import { addToCartValidation } from "../validation/cart";

const router = Router();

router.post('/add', addToCartValidation, authMiddleware, addCartController);

router.get('/get', authMiddleware, getCartController);

router.delete('/delete', authMiddleware, deleteCartController);

export default router;