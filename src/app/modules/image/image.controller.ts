import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../shard/catchAsync";
import sendResponse from "../../../shard/sendResponse";
import { ImageService } from "./image.service";

const createImage = catchAsync(async (req: Request, res: Response) => {
  const result = await ImageService.createImage(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Single image inserted into db.",
    data: result,
  });
});

export const ImageController = {
  createImage,
};
