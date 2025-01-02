import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import config from "../../../config";
import { catchAsync } from "../../../shard/catchAsync";
import sendResponse from "../../../shard/sendResponse";
import { IRefreshTokenResponse } from "./auth.interface";
import { AuthService } from "./auth.service";

const register = catchAsync(async (req: Request, res: Response) => {
  const { ...data } = req.body;
  const result = await AuthService.register(data);

  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User Created Successfully!",
    token: accessToken,
  });
});

const requestAdminRegister = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.requestAdminRegister(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Check your email",
    data: result,
  });
});

const adminRegister = catchAsync(async (req: Request, res: Response) => {
  const { ...data } = req.body;

  const result = await AuthService.adminRegister(data);
  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin created successfully!",
    token: accessToken,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;

  const result = await AuthService.login(loginData);

  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User login successfully!",
    token: accessToken,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);
  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };
  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User Loggedin successfully",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Check your email!!",
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  await AuthService.logout(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Log out successfully",
  });
});

export const AuthController = {
  register,
  requestAdminRegister,
  adminRegister,
  login,
  refreshToken,
  forgotPassword,
  logout,
};
