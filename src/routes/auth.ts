import { Router } from "express";
import {
  loginByTokenController,
  loginController,
  RegisterController,
  resetPasswordController,
  SendOTPController,
  validateOTPController,
} from "../controller/auth";
import {
  checkOTPValidation,
  forgetPasswordValidation,
  loginValidation,
  otpValidation,
  registerValidation,
} from "../validation/auth";

const router = Router();

router.post("/register", registerValidation, RegisterController);

router.post("/otp", otpValidation, SendOTPController);

router.post("/login", loginByTokenController, loginValidation, loginController);

router.post("/validate", checkOTPValidation, validateOTPController);

router.post("/reset", forgetPasswordValidation, resetPasswordController);

export default router;
