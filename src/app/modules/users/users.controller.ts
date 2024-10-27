import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User } from "@prisma/client";
import { paginationFields } from "../../../constants/paginationFields";
import { catchAsync } from "../../../shard/catchAsync";
import pick from "../../../shard/pick";
import sendResponse from "../../../shard/sendResponse";
import { userFilterableFields } from "./user.constant";
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

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await UsersService.getAllUsers(filters, options);

  sendResponse<User[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users fetched successfully!!",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;
  const result = await UsersService.getSingleUser(email);

  sendResponse<User>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User fetched successfully!!",
    data: result,
  });
});

export const UsersController = {
  createUser,
  getAllUsers,
  getSingleUser,
};
