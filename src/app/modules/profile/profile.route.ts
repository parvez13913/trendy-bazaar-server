import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import { ProfileController } from "./profile.controller";

const router = express.Router();

router.get(
  "/",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ProfileController.getProfile
);

router.patch("/", auth(ENUM_USER_ROLE.ADMIN), ProfileController.updateProfile);

export const ProfileRoutes = router;
