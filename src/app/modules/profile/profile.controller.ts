import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../shard/catchAsync";
import sendResponse from "../../../shard/sendResponse";
import { ProfileService } from "./profile.service";

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const result = await ProfileService.getProfile(token!);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Profile data fetch successfully!",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const result = await ProfileService.updateProfile(token!, req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

export const ProfileController = {
  getProfile,
  updateProfile,
};
