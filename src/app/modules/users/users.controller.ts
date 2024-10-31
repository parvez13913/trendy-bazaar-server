import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { User } from "@prisma/client";
import { paginationFields } from "../../../constants/paginationFields";
import { catchAsync } from "../../../shard/catchAsync";
import pick from "../../../shard/pick";
import sendResponse from "../../../shard/sendResponse";
import { userFilterableFields } from "./user.constant";
import { UsersService } from "./users.service";

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

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;
  const { ...updatedData } = req.body;

  const result = await UsersService.updateUser(email, updatedData);

  sendResponse<User>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User updated successfully!!",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;
  const result = await UsersService.deleteUser(email);

  sendResponse<User>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User deleted successfully!!",
    data: result,
  });
});

export const UsersController = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
