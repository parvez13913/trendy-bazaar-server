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

const getSingleProductCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductCategoryService.getSingleProductCategory(
      Number(req.params.id)
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product category fetched successfully!!",
      data: result,
    });
  }
);

const getAllProductCategories = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductCategoryService.getAllProductCategories();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product category fetched successfully!!",
      data: result,
    });
  }
);

const updateProductCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductCategoryService.updateProductCategory(
      Number(req.params.id),
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product category updated",
      data: result,
    });
  }
);

const deleteProductCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductCategoryService.deleteProductCategory(
      Number(req.params.id)
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product category deleted",
      data: result,
    });
  }
);

export const ProductCategoryController = {
  createProductCategory,
  getAllProductCategories,
  getSingleProductCategory,
  updateProductCategory,
  deleteProductCategory,
};
