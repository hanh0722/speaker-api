import { Router } from "express";
import {
  addCompareProductToUserController,
  createProductController,
  getProductByIdController,
  getProductController,
  onDeleteCompareProduct,
  onEditProduct,
  onHandleDeleteProduct,
  suggestProductsController,
} from "../controller/product";
import { authMiddleware } from "../middleware/auth";
import { validateUserByRole } from "../middleware/validate-user";
import { userMiddleware } from "../middleware/user";
import {
  compareProductValidation,
  createProductValidation,
  deleteCompareProductValidation,
  deleteProductsValidation,
  editProductValidation,
} from "../validation/product";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  createProductValidation,
  validateUserByRole,
  createProductController
);

router.get("/get", getProductController);

router.get("/get/:id", userMiddleware, getProductByIdController);

router.post(
  "/compare",
  authMiddleware,
  compareProductValidation,
  addCompareProductToUserController
);

router.get("/suggest/:id", suggestProductsController);

router.delete(
  "/compare/:id",
  authMiddleware,
  deleteCompareProductValidation,
  onDeleteCompareProduct
);

router.post(
  "/delete",
  authMiddleware,
  deleteProductsValidation,
  validateUserByRole,
  onHandleDeleteProduct
);

router.put('/edit/:id', authMiddleware, editProductValidation, validateUserByRole, onEditProduct);

export default router;
