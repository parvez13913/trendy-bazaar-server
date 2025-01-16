import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validate-request";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/register",
  validateRequest(AuthValidation.registerZodSchema),
  AuthController.register
);

router.post(
  "/request-admin-register",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AuthController.requestAdminRegister
);

router.post("/admin-register", AuthController.adminRegister);

router.post("/login", AuthController.login);

router.post("/logout", AuthController.logout);

router.post("/refresh-token", AuthController.refreshToken);

router.post("/reset-password", AuthController.resetPassword);

router.post("/forgot-password", AuthController.forgotPassword);

export const AuthRoutes = router;
