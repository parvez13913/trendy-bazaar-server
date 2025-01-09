import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get(
  "/:email",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AdminController.getSingleAdmin
);

router.get("/", auth(ENUM_USER_ROLE.SUPER_ADMIN), AdminController.getAllAdmins);

export const AdminRoutes = router;
