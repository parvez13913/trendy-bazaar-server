import express from "express";
import { ImageController } from "./image.controller";

const router = express.Router();

router.post("/", ImageController.createImage);

export const ImageRoutes = router;
