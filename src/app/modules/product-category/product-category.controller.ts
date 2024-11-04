import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../shard/catchAsync";
import sendResponse from "../../../shard/sendResponse";
import { ProductCategoryService } from "./product-category.service";

const createProductCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductCategoryService.createProductCategory(req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product category created",
      data: result,
    });
  }
);

export const ProductCategoryController = {
  createProductCategory,
};
