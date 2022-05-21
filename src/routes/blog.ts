import { Router } from "express";
import { createBlogController, getBlogByIdController, getBlogController, getTagController } from "../controller/blog";
import { authMiddleware } from "../middleware/auth";
import { validateUserByRole } from "../middleware/validate-user";
import { validateCreateBlog } from "../validation/blog";

const router = Router();

router.post(
  "/create",
  validateCreateBlog,
  authMiddleware,
  validateUserByRole,
  createBlogController
);

router.get('/suggest/tags', getTagController);

router.get('/get', getBlogController);

router.get('/get/:id', getBlogByIdController);

export default router;
