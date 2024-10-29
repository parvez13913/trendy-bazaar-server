import { Request, Response } from "express";
import { catchAsync } from "../../../shard/catchAsync";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
  const { ...signInData } = req.body;
  const result = await AuthService.login(signInData);
});

export const AuthController = {
  login,
};
