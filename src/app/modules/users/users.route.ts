import express from "express";
import { UsersController } from "./users.controller";

const router = express.Router();

router.get("/", UsersController.getAllUsers);

router.get("/:email", UsersController.getSingleUser);

router.post("/create-user", UsersController.createUser);

router.patch("/:email", UsersController.updateUser);

router.delete("/:email", UsersController.deleteUser);

export const UserRoutes = router;
