import express from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import { UsersController } from "./users.controller";

const router = express.Router();

router.get("/", auth(ENUM_USER_ROLE.SUPER_ADMIN), UsersController.getAllUsers);

router.get("/:email", UsersController.getSingleUser);

router.patch("/:email", UsersController.updateUser);

router.delete("/:email", UsersController.deleteUser);

export const UserRoutes = router;
