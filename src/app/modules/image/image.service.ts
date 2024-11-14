import { Request } from "express";
import { FileUploadHelper } from "../../../helpers/file-uploadHelper ";
import { IUploadFile } from "../../../interface/file";

const createImage = async (req: Request) => {
  const file = req.file as IUploadFile;
  const uploadedImage = await FileUploadHelper.uploadToCloudinary(file);

  return uploadedImage?.url;
};

const createManyImage = async (req: Request) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) throw new Error("No files provided");

  const result = await FileUploadHelper.uploadMultipleToCloudinary(files);

  return result;
};

export const ImageService = {
  createImage,
  createManyImage,
};
