import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../../shard/catchAsync";
import sendResponse from "../../../shard/shard";
import { UsersService } from "./users.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { ...data } = req.body;
  const result = await UsersService.createUser(data);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User Created Successfully!",
    data: result,
  });
});

export const UsersController = {
  createUser,
};
