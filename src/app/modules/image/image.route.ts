import express, { NextFunction, Request, Response } from "express";
import { FileUploadHelper } from "../../../helpers/file-uploadHelper ";
import { ImageController } from "./image.controller";

const router = express.Router();

router.post(
  "/single",
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    return ImageController.createImage(req, res, next);
  }
);

export const ImageRoutes = router;
