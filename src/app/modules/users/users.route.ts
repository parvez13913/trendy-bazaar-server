import express from "express";
import { UsersController } from "./users.controller";

const router = express.Router();

router.get("/", UsersController.getAllUsers);

router.get("/:id", UsersController.getSingleUser);

router.post("/create-user", UsersController.createUser);

router.patch("/:email", UsersController.updateUser);

export const UserRoutes = router;
