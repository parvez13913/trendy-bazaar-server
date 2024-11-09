import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../shard/catchAsync";
import sendResponse from "../../../shard/sendResponse";
import { SubProductCategoryService } from "./sub-product-category.service";

const createSubProductCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubProductCategoryService.createSubProductCategory(
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Sub product category created",
      data: result,
    });
  }
);

export const SubProductCategoryController = {
  createSubProductCategory,
};
