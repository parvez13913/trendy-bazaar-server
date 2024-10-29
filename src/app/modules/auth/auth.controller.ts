import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import config from "../../../config";
import { catchAsync } from "../../../shard/catchAsync";
import sendResponse from "../../../shard/sendResponse";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.login(loginData);
  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  const { refreshToken, token } = result;

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User login successfully!",
    token: token,
  });
});

export const AuthController = {
  login,
};
