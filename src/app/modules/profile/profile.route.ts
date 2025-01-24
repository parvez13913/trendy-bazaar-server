import express, { NextFunction, Request, Response } from "express";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { FileUploadHelper } from "../../../helpers/file-uploadHelper ";
import auth from "../../middlewares/auth";
import { ProfileController } from "./profile.controller";
import { ProfileValidation } from "./profile.validation";

const router = express.Router();

router.get(
  "/",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ProfileController.getProfile
);

router.patch(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  FileUploadHelper.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = ProfileValidation.profileZodSchema.parse(
      JSON.parse(req.body.data)
    );

    return ProfileController.updateProfile(req, res, next);
  }
);

export const ProfileRoutes = router;
