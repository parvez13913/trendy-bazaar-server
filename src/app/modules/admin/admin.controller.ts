import { Admin } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { paginationFields } from "../../../constants/paginationFields";
import { catchAsync } from "../../../shard/catchAsync";
import pick from "../../../shard/pick";
import sendResponse from "../../../shard/sendResponse";
import { adminFilterableFields } from "./admin.constants";
import { AdminService } from "./admin.service";

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await AdminService.getAllAdmins(filters, options);

  sendResponse<Admin[]>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin fetched successfully!!",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;
  const result = await AdminService.getSingleAdmin(email);
  sendResponse<Admin>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin fetched successfully!!",
    data: result,
  });
});

export const AdminController = {
  getAllAdmins,
  getSingleAdmin,
};
