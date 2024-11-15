import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.post("/refresh-token", AuthController.refreshToken);

router.post("/forgot-password", AuthController.forgotPassword);

export const AuthRoutes = router;
