import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shard/sendResponse";
import { ProfileService } from "./profile.service";

const getProfile = async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const result = await ProfileService.getProfile(token!);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "profile data fetch successfully!",
    data: result,
  });
};

export const ProfileController = {
  getProfile,
};
